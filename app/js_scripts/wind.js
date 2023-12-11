  //Wind
  function switchWind() {
    // console.log(timespanLower);

    if (
      document.querySelector("#checkbox_wind").checked &&
      timespanLower != 1440
    ) {
      const current_time = new Date();
      let day = String(current_time.getFullYear());
      if (current_time.getMonth() + 1 < 10) {
        day += "0";
        day += current_time.getMonth() + 1;
      } else {
        day += current_time.getMonth() + 1;
      }
      if (current_time.getDate() < 10) {
        day += "0";
        day += current_time.getDate();
      } else {
        day += current_time.getDate();
      }
      let hour = "";
      if (current_time.getHours() < 10) {
        hour += "0";
        hour += current_time.getHours();
      } else {
        hour += current_time.getHours();
      }

      let wind_link =
        "https://meteo.atmosud.org/" +
        day +
        "/wind_field_" +
        hour +
        ".json";
      console.log(wind_link);

      $.getJSON(wind_link, function (data) {
        velocityLayer = L.velocityLayer({
          displayValues: false,
          displayOptions: false,
          data: data,
          velocityScale: 0.002,
          colorScale: ["#71C3F2", "#447591"],
          minVelocity: 1,
          maxVelocity: 5,
          overlayName: "wind_layer",
        }).addTo(map);
      });
    } else {
      if (velocityLayer != undefined) {
        velocityLayer.remove();
      }
      if (timespanLower == 1440) {
        openToast(
          "La modélisation des vents présente des observations horaires."
        );
      }
      document.querySelector("#checkbox_wind").checked = false;
    }
  }
