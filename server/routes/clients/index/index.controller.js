const { db } = require("../../../models/index");
const { user: User, itinerary: Itinerary, destination: Destination, packages: Packages } = db;
const { loginTravelAPI, searchCityID, searchHotel } = require("../../../helpers/travelApi");

const { compare } = require("../../../helpers/hashing");
const response = require("../../../helpers/response");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pages Render
const indexPage = async (req, res) => {
  const destination = await Destination.findAll({ limit: 3 });
  const package = await Packages.findAll({ limit: 3 });
  res.render("pages/clients/index/index.njk", { destination, package });
};

const loginPage = (req, res) => {
  res.render("pages/admin/auth/login.njk");
};

const registerPage = (req, res) => {
  res.render("pages/admin/auth/register.njk");
};

const aboutUsPage = (req, res) => {
  res.render("pages/clients/index/aboutUs.njk");
};

const contactUsPage = (req, res) => {
  res.render("pages/clients/index/contactUs.njk");
};

// Logic
const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  //validasi inputan email dan password
  if (!email || !password) {
    return response.res400("Mohon masukkan email atau password", res);
  }

  if (password != confirmPassword) {
    return response.res400("Maaf password yang anda masukkan tidak sama", res);
  }

  try {
    //cek email pada sistem
    const user = await User.findOne({ where: { email } });
    if (user) {
      return response.res400("Maaf email anda telah terdaftar", res);
    }

    const role = "user";

    //create data
    await User.create({ email, password, name, role });
    response.res201("Registrasi anda berhasil", null, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //validasi inputan email dan password
  if (!email || !password) {
    return response.res400("Mohon masukkan email atau password", res);
  }
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.res403("Maaf anda belum melakukan registrasi", res);
    }

    const validPw = await compare(password, user.password);
    if (!validPw) {
      return response.res403("Maaf password yang anda masukkan salah", res);
    }

    const currentTime = new Date();

    const payload = {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      entryTime: currentTime,
    };

    req.session.user = payload;

    response.res200("Login berhasil", payload, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }

      // response.res200("Logout berhasil", null, res);
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const getHotels = async (req, res) => {
  const { lokasi, lama_perjalanan } = req.body;
  const cityID = await searchCityID(lokasi);
  const hotels = await searchHotel(cityID, Number(lama_perjalanan));
  console.log(hotels);
  res.json({
    status: {
      code: 200,
      message: "Success fetching all hotels",
    },
    hotels,
  });
};

const generateItinerary = async (req, res) => {
  const { lokasi, jumlah_orang, mata_uang, budget, musim, lama_perjalanan, tipe_perjalanan, transportasi } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // hit api;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant, and good planner.",
      },
      {
        role: "user",
        content: `
      Tolong buatkan rencana perjalanan dengan rincian waktu dan rincian perkiraan biaya selama perjalanan dengan anggaran ${budget} ${mata_uang} dalam format Rp. per orang selama ${lama_perjalanan} hari, untuk perjalanan ${tipe_perjalanan} pada musim ${musim}, di ${lokasi} untuk ${jumlah_orang} orang, dengan transportasi ${transportasi}. Buatkan dalam format HTML, namun langsung isi nya saja, child dari <article>. Tulis dengan jelas dan menarik serta bold nama tempat yang dikunjungi. Terima kasih.
    `,
      },
    ],
    temperature: 0,
    stream: true,
  });

  try {
    let fullResult = "";

    for await (const chunk of completion) {
      const result = chunk.choices[0].delta.content;
      if (result) {
        fullResult += result;
        res.write(result);
      }
    }

    console.log(fullResult);

    await Itinerary.create({
      lokasi,
      jumlah_orang,
      mata_uang,
      budget,
      musim,
      lama_perjalanan,
      tipe_perjalanan,
      transportasi,
      hasil_itinerary: fullResult,
    });
  } catch (error) {
    console.log(error);
    res.write("error generate itinerary");
  }
};

module.exports = {
  indexPage,
  loginPage,
  registerPage,
  login,
  aboutUsPage,
  contactUsPage,
  register,
  logout,
  generateItinerary,
  getHotels,
};
