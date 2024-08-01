const { db } = require("../../../models/index");
const { packages, destination, packages_destination, trip_type, Sequelize, acomodation, transportation, restaurant, packages_acomodation, packages_transportation, packages_restaurant } = db;

const response = require("../../../helpers/response");


// Pages Render
const packagesPage = async (req, res) => {
  try {
    const package = await packages.findAll({});
    res.render("pages/clients/packages/packages.njk", { package });
  } catch (error) {
    console.log(error.message);
  }
  // res.render("pages/clients/packages/packages.njk");
};

const detailPackagePage = async(req, res) => {
  const { id } = req.params;
  try {
    const package = await packages.findOne({
      where: { id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: destination,
          attributes: ["id", "name", "address", "district_city", "images"],
          include: [
            {
              model: trip_type,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: acomodation,
          attributes: ["id", "name", "images", "address", "price"],
        },
        {
          model: transportation,
          attributes: ["id", "name", "images", "route", "price"],
        },
        {
          model: restaurant,
          attributes: ["id", "name", "images", "address", "price"],
        },
      ],
    });
    console.log(package.Destinations);

    package.images = `${package.images}`;
    package.createdAt = package.createdAt.toISOString().split("T")[0];
    package.updatedAt = package.updatedAt.toISOString().split("T")[0];

    // return res.status(200).json({
    //   package
    // });
    res.render("pages/clients/packages/detailPackages.njk", { package });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
  // res.render("pages/clients/packages/detailPackages.njk");
};

// Logic
// const generateItinerary = async (req, res) => {
//   const { lokasi, jumlah_orang, mata_uang, budget, musim, lama_perjalanan, tipe_perjalanan, transportasi } = req.body;
//   res.writeHead(200, {
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//   });

//   // hit api;
//   const completion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       { role: "system", content: "You are a helpful assistant, and good planner." },
//       {
//         role: "user",
//         content: `
//       Tolong buatkan rencana perjalanan dengan rincian waktu dan rincian perkiraan biaya selama perjalanan dengan anggaran ${budget} ${mata_uang} per orang selama ${lama_perjalanan} hari, untuk perjalanan ${tipe_perjalanan} pada musim ${musim}, di ${lokasi} untuk ${jumlah_orang} orang, dengan transportasi ${transportasi}. Buatkan dalam format HTML, namun langsung isi nya saja, child dari <article>. Tulis dengan jelas dan menarik serta bold nama tempat yang dikunjungi. Terima kasih.
//     `,
//       },
//     ],
//     temperature: 0,
//     stream: true,
//   });

//   try {
//     for await (const chunk of completion) {
//       const result = chunk.choices[0].delta.content;
//       if (result) {
//         res.write(result);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.write("error generate itinerary");
//   }
// };

module.exports = {
  packagesPage,
  detailPackagePage,
};
