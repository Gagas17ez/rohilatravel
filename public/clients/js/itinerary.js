$("#jumlah_orang, #budget, #lama_perjalanan").on("change", function () {
  let inputValue = parseInt($(this).val());

  if (inputValue < 0) {
    $(this).val(0);
  }
});

async function getHotels(lokasi, lama_perjalanan) {
  const hotels = $("#hotels");
  const hotelResponse = await fetch("/hotels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lokasi, lama_perjalanan }),
  });
  const hotelData = await hotelResponse.json();
  if (hotelResponse.ok) {
    console.log(hotelData.hotels);
    hotels.removeClass("d-none");

    // Create hotel cards
    let hotelCards = '<div class="row">';
    hotelData.hotels.forEach((hotel, index) => {
      const refactoredLogoUrl = hotel.logo.replace("https://61.8.74.42:7080", "https://uat.darmawisataindonesiah2h.co.id:7080");

      hotelCards += `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
            <img src="${refactoredLogoUrl}" class="card-img-top" alt="${hotel.name}">
              <div class="card-body">
                <h5 class="card-title">${hotel.name}</h5>
                <p class="card-text">Address: ${hotel.address}</p>
                <p class="card-text">Rating: ${hotel.rating}</p>
                <p class="card-text">Price: ${hotel.priceStart}</p>
              </div>
              <div class="card-footer">
                <div class="row">
                  <a href="https://api.whatsapp.com/send?phone=6281333646054&amp;text=Halo, dengan Admin Rusli Travel? Saya ingin pesan kamar hotel di ${hotel.name}" class="btn btn-primary" target="_blank">Pesan Sekarang</a>
                </div>
              </div>
            </div>
          </div>
        `;

      if ((index + 1) % 3 === 0) {
        hotelCards += '</div><div class="row">';
      }
    });

    hotelCards += "</div>";
    hotels.html(hotelCards);
  }
}

async function generateItinerary() {
  const lokasi = $("#lokasi").val();
  const jumlah_orang = $("#jumlah_orang").val();
  const mata_uang = $("#mata_uang").val();
  const budget = $("#budget").val();
  const musim = $("#musim").val();
  const lama_perjalanan = $("#lama_perjalanan").val();
  const tipe_perjalanan = $("#tipe_perjalanan").val();
  const transportasi = $("#transportasi").val();
  const output = $("#result");

  if (!lokasi || !jumlah_orang || !mata_uang || !budget || !musim || !lama_perjalanan || !tipe_perjalanan || !transportasi) {
    return alert("Harap mengisi semua data");
  }

  getHotels(lokasi, lama_perjalanan);

  $("#btn-plan img").removeClass("d-none");
  $("#btn-plan").prop("disabled", true);
  $("#btn-plan span").text("Planning.....");

  const response = await fetch("/itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lokasi, jumlah_orang, mata_uang, budget, musim, lama_perjalanan, tipe_perjalanan, transportasi }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let isFinished = false;
  let chunk = "";
  output.removeClass("d-none");
  $("#btn-plan img").addClass("d-none");
  $("#btn-plan").prop("disabled", false);
  $("#btn-plan span").text("Start Planning");
  while (!isFinished) {
    const { done, value } = await reader.read();
    if (done) {
      isFinished = true;
      break;
    }

    const chunkText = decoder.decode(value);
    chunk += chunkText;
    output.html(chunk);
  }
}
