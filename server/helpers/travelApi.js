const crypto = require("crypto");

const generateToken = () => {
  const now = new Date();
  return now.toISOString();
};

const generateSecurityCode = (token, password) => {
  const passwordMd5 = crypto.createHash("md5").update(password).digest("hex");
  const securityCode = crypto
    .createHash("md5")
    .update(token + passwordMd5)
    .digest("hex");
  return securityCode;
};

const loginTravelAPI = async () => {
  const userId = process.env.USER_ID_TRAVEL;
  const password = process.env.PASSWORD_TRAVEL;

  // Generate token and security code
  const token = generateToken();
  const securityCode = generateSecurityCode(token, password);

  // JSON Body
  const payload = {
    token: token,
    securityCode: securityCode,
    userID: userId,
  };

  // URL
  const url = "https://uat.darmawisataindonesiah2h.co.id:7080/H2H/Session/Login";

  try {
    // Making POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse JSON response
    const data = await response.json();

    // Print response
    console.log("Response Status Code:", response.status);
    console.log("Response Content:", data);
    accessToken = data.accessToken;
    console.log(accessToken);
    return accessToken;
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

const searchCityID = async (city) => {
  try {
    const url = "https://uat.darmawisataindonesiah2h.co.id:7080/H2H/Hotel/AllCity5";

    const userId = process.env.USER_ID_TRAVEL;
    const accessToken = await loginTravelAPI();

    const payload = {
      countryID: "ID",
      userID: userId,
      accessToken: accessToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Response Status Code:", response.status);
      console.log("Response Content:", data);

      const cityInfo = data.cities.find((item) => item.Name.toLowerCase() === city.toLowerCase());

      if (cityInfo) {
        console.log(`City ID for ${city} is ${cityInfo.ID}`);
        return cityInfo.ID;
      } else {
        console.log(`City ${city} not found.`);
        return null;
      }
    } else {
      console.error("Failed to fetch city data:", data);
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
};

const searchHotel = async (cityID, days) => {
  try {
    const url = "https://uat.darmawisataindonesiah2h.co.id:7080/H2H/Hotel/Search5";

    const userId = process.env.USER_ID_TRAVEL;
    const accessToken = await loginTravelAPI();

    checkInDateNow = new Date();
    checkInDateNow.setDate(checkInDateNow.getDate() + 1); // Adding 1 day to the current date
    checkOutDateNow = new Date(checkInDateNow);
    console.log("====== CHECK IN =====");
    console.log(checkInDateNow);
    checkOutDateNow.setDate(checkOutDateNow.getDate() + Number(days));
    console.log("====== CHECK OUT =====");
    console.log(checkOutDateNow);

    const payload = {
      paxPassport: "ID",
      countryID: "ID",
      cityID: cityID,
      checkInDate: checkInDateNow,
      checkOutDate: checkOutDateNow,
      roomRequest: [
        {
          roomType: 4,
        },
      ],
      userID: userId,
      accessToken: accessToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      console.log(data.hotels);
      return data.hotels;
    } else {
      console.error("Failed to fetch hotel data:", data);
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
};

module.exports = {
  loginTravelAPI,
  searchCityID,
  searchHotel,
};
