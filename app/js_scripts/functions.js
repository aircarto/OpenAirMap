function mobileTest() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
  
  //Automatic location 
  function goToPosition(position) {
    map.setView(
      [position.coords.latitude, position.coords.longitude],
      zoomLevel
    );
  }

  function notAllowed(err) {
    openToast("Vous n'avez pas autorisé la détection de la position."); 
    map.setView(coordsCenter, zoomLevel);
  }
 
  //Events for button clicks to choose compound and timespan
  function choosePM1() {
    document
      .querySelector("#button_PM10")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#button_PM25")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#button_PM1")
      .classList.replace("btn-outline-primary", "btn-primary");
    compoundUpper = "PM1";
    document.querySelector("#div_button_seuils_PM10").style.visibility =
      "hidden";
    document.querySelector("#div_button_seuils_PM125").style.visibility =
      "visible";

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      nebuleairParticuliers.clearLayers();
      changeNebuleAir();
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      stationsMicroAtmoSud.clearLayers();
      changeStationMicroAtmo();
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      sensorCommunity.clearLayers();
      changeSensorCommunity();
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      stationsRefAtmoSud.clearLayers();
      changeStationRefAtmo();
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      purpleAir.clearLayers();
      changePurpleAir();
    }

    if (document.querySelector("#checkbox_modelisationPMAtmoSud").checked) {
      modelisationPMAtmoSud.clearLayers();
      loadModelisationPMAtmo();
      document.querySelector(
        "#checkbox_modelisationPMAtmoSud"
      ).checked = false;
    }

    setQueryString();
  }

  function choosePM25() {
    document
      .querySelector("#button_PM10")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#button_PM25")
      .classList.replace("btn-outline-primary", "btn-primary");
    document
      .querySelector("#button_PM1")
      .classList.replace("btn-primary", "btn-outline-primary");
    compoundUpper = "PM25";
    document.querySelector("#div_button_seuils_PM10").style.visibility =
      "hidden";
    document.querySelector("#div_button_seuils_PM125").style.visibility =
      "visible";

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      nebuleairParticuliers.clearLayers();
      changeNebuleAir();
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      stationsMicroAtmoSud.clearLayers();
      changeStationMicroAtmo();
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      sensorCommunity.clearLayers();
      changeSensorCommunity();
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      stationsRefAtmoSud.clearLayers();
      changeStationRefAtmo();
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      purpleAir.clearLayers();
      changePurpleAir();
    }

    if (document.querySelector("#checkbox_modelisationPMAtmoSud").checked) {
      modelisationPMAtmoSud.clearLayers();
      loadModelisationPMAtmo();
    }
    setQueryString();
  }

  function choosePM10() {
    document
      .querySelector("#button_PM10")
      .classList.replace("btn-outline-primary", "btn-primary");
    document
      .querySelector("#button_PM25")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#button_PM1")
      .classList.replace("btn-primary", "btn-outline-primary");
    compoundUpper = "PM10";
    document.querySelector("#div_button_seuils_PM10").style.visibility =
      "visible";
    document.querySelector("#div_button_seuils_PM125").style.visibility =
      "hidden";

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      nebuleairParticuliers.clearLayers();
      changeNebuleAir();
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      stationsMicroAtmoSud.clearLayers();
      changeStationMicroAtmo();
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      sensorCommunity.clearLayers();
      changeSensorCommunity();
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      stationsRefAtmoSud.clearLayers();
      changeStationRefAtmo();
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      purpleAir.clearLayers();
      changePurpleAir();
    }

    if (document.querySelector("#checkbox_modelisationPMAtmoSud").checked) {
      modelisationPMAtmoSud.clearLayers();
      loadModelisationPMAtmo();
    }
    setQueryString();
  }

  function chooseActuel() {
    document
      .querySelector("#btn_journalier")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_horaire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_quartHoraire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_actuel")
      .classList.replace("btn-outline-primary", "btn-primary");
    timespanLower = 2;

    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    document.querySelector("#button_horloge").innerHTML =
      hour + ":" + (min < 10 ? "0" : "") + min; //2min par

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      if (
        apiFetchNebuleAir.timespan != 2 ||
        apiFetchNebuleAir.data.length == 0 ||
        (apiFetchNebuleAir.data.length != 0 &&
          Date.now() - apiFetchNebuleAir.timestamp > 2 * 60 * 1000)
      ) {
        nebuleairParticuliers.clearLayers();
        loadNebuleAir();
      } else {
        nebuleairParticuliers.clearLayers();
        changeNebuleAir();
      }
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      document.querySelector(
        "#checkbox_micro_stationsAtmoSud"
      ).checked = false;
      map.removeLayer(stationsMicroAtmoSud);
      openToast(
        "Pas de données à intervalle 2 minutes pour les microstations AtmoSud"
      );
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      document.querySelector(
        "#checkbox_stationsRefAtmoSud"
      ).checked = false;
      map.removeLayer(stationsRefAtmoSud);
      openToast(
        "Pas de données à intervalle 2 minutes pour les stations de référence AtmoSud"
      );
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      if (
        apiFetchPurpleAir.timespan != 2 ||
        apiFetchPurpleAir.data.length == 0 ||
        (apiFetchPurpleAir.data.length != 0 &&
          Date.now() - apiFetchPurpleAir.timestamp > 2 * 60 * 1000)
      ) {
        purpleAir.clearLayers();
        loadPurpleAir();
      } else {
        purpleAir.clearLayers();
        changePurpleAir();
      }
    }
    setQueryString();
  }

  function choose15() {
    document
      .querySelector("#btn_journalier")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_horaire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_quartHoraire")
      .classList.replace("btn-outline-primary", "btn-primary");
    document
      .querySelector("#btn_actuel")
      .classList.replace("btn-primary", "btn-outline-primary");
    timespanLower = 15;

    const end = new Date();
    const hour2 = end.getHours();
    const min_ori2 = end.getMinutes();

    if (min_ori2 <= 15) {
      var min2 = 0;
    } else if (min_ori2 > 15 && min_ori2 <= 30) {
      var min2 = 15;
    } else if (min_ori2 > 30 && min_ori2 <= 45) {
      var min2 = 30;
    } else {
      var min2 = 45;
    }

    const get_start = end.setMinutes(end.getMinutes() - 15);
    const start = new Date(get_start);
    const hour1 = start.getHours();
    const min_ori1 = start.getMinutes();

    if (min_ori1 <= 15) {
      var min1 = 0;
    } else if (min_ori1 > 15 && min_ori1 <= 30) {
      var min1 = 15;
    } else if (min_ori1 > 30 && min_ori1 <= 45) {
      var min1 = 30;
    } else {
      var min1 = 45;
    }

    document.querySelector("#button_horloge").innerHTML =
      hour1 +
      ":" +
      (min1 < 10 ? "0" : "") +
      min1 +
      " à " +
      hour2 +
      ":" +
      (min2 < 10 ? "0" : "") +
      min2;

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      if (
        apiFetchNebuleAir.timespan != 15 ||
        apiFetchNebuleAir.data.length == 0 ||
        (apiFetchNebuleAir.data.length != 0 &&
          Date.now() - apiFetchNebuleAir.timestamp > 15 * 60 * 1000)
      ) {
        nebuleairParticuliers.clearLayers();
        loadNebuleAir();
      } else {
        nebuleairParticuliers.clearLayers();
        changeNebuleAir();
      }
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      document.querySelector("#checkbox_sensor_community").checked = false;
      map.removeLayer(sensorCommunity);
      openToast(
        "Pas de données à intervalle 15 minutes pour les capteurs Sensor.Community"
      );
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      if (
        apiFetchAtmoSudRef.timespan != 15 ||
        apiFetchAtmoSudRef.data.length == 0 ||
        (apiFetchAtmoSudRef.data.length != 0 &&
          Date.now() - apiFetchAtmoSudRef.timestamp > 15 * 60 * 1000)
      ) {
        stationsRefAtmoSud.clearLayers();
        loadStationRefAtmo();
      } else {
        stationsRefAtmoSud.clearLayers();
        changeStationRefAtmo();
      }
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      if (
        apiFetchPurpleAir.timespan != 15 ||
        apiFetchPurpleAir.data.length == 0 ||
        (apiFetchPurpleAir.data.length != 0 &&
          Date.now() - apiFetchPurpleAir.timestamp > 15 * 60 * 1000)
      ) {
        purpleAir.clearLayers();
        loadPurpleAir();
      } else {
        purpleAir.clearLayers();
        changePurpleAir();
      }
    }

    setQueryString();
  }

  function choose60() {
    document
      .querySelector("#btn_journalier")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_horaire")
      .classList.replace("btn-outline-primary", "btn-primary");
    document
      .querySelector("#btn_quartHoraire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_actuel")
      .classList.replace("btn-primary", "btn-outline-primary");
    timespanLower = 60;

    const end = new Date();
    const hour2 = end.getHours();
    const min2 = end.getMinutes();
    const get_start = end.setHours(end.getHours() - 1);
    const start = new Date(get_start);
    const hour1 = start.getHours();
    const min1 = start.getMinutes();
    // document.querySelector("#button_horloge").innerHTML = hour1 + ":" + (min1 < 10 ? '0' : '') + min1 + " à " + hour2 + ":" + (min2 < 10 ? '0' : '') + min2 ;
    document.querySelector("#button_horloge").innerHTML =
      hour1 + ":" + "00" + " à " + hour2 + ":" + "00";

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      if (
        apiFetchNebuleAir.timespan != 60 ||
        apiFetchNebuleAir.data.length == 0 ||
        (apiFetchNebuleAir.data.length != 0 &&
          Date.now() - apiFetchNebuleAir.timestamp > 60 * 60 * 1000)
      ) {
        nebuleairParticuliers.clearLayers();
        loadNebuleAir();
      } else {
        nebuleairParticuliers.clearLayers();
        changeNebuleAir();
      }
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      document.querySelector("#checkbox_sensor_community").checked = false;
      map.removeLayer(sensorCommunity);
      openToast(
        "Pas de données à intervalle 1 heure pour les capteurs Sensor.Community"
      );
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      document.querySelector(
        "#checkbox_micro_stationsAtmoSud"
      ).checked = false;
      map.removeLayer(stationsMicroAtmoSud);
      openToast(
        "Pas de données à intervalles 1 heure pour les microstations AtmoSud"
      );
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      if (
        apiFetchAtmoSudRef.timespan != 60 ||
        apiFetchAtmoSudRef.data.length == 0 ||
        (apiFetchAtmoSudRef.data.length != 0 &&
          Date.now() - apiFetchAtmoSudRef.timestamp > 60 * 60 * 1000)
      ) {
        stationsRefAtmoSud.clearLayers();
        loadStationRefAtmo();
      } else {
        stationsRefAtmoSud.clearLayers();
        changeStationRefAtmo();
      }
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      if (
        apiFetchPurpleAir.timespan != 60 ||
        apiFetchPurpleAir.data.length == 0 ||
        (apiFetchPurpleAir.data.length != 0 &&
          Date.now() - apiFetchPurpleAir.timestamp > 60 * 60 * 1000)
      ) {
        purpleAir.clearLayers();
        loadPurpleAir();
      } else {
        purpleAir.clearLayers();
        changePurpleAir();
      }
    }
    setQueryString();
  }

  function choose1440() {
    document
      .querySelector("#btn_journalier")
      .classList.replace("btn-outline-primary", "btn-primary");
    document
      .querySelector("#btn_horaire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_quartHoraire")
      .classList.replace("btn-primary", "btn-outline-primary");
    document
      .querySelector("#btn_actuel")
      .classList.replace("btn-primary", "btn-outline-primary");
    timespanLower = 1440;

    const date = new Date();
    const get_datemoins1 = date.setHours(date.getHours() - 24);
    const datemoins1 = new Date(get_datemoins1);
    const jour = datemoins1.getDate();
    const mois = datemoins1.getMonth() + 1;
    document.querySelector("#button_horloge").innerHTML =
      (jour < 10 ? "0" : "") + jour + "/" + (mois < 10 ? "0" : "") + mois; //2min par défaut

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      if (
        apiFetchNebuleAir.timespan != 1440 ||
        apiFetchNebuleAir.data.length == 0 ||
        (apiFetchNebuleAir.data.length != 0 &&
          Date.now() - apiFetchNebuleAir.timestamp > 1440 * 60 * 1000)
      ) {
        nebuleairParticuliers.clearLayers();
        loadNebuleAir();
      } else {
        nebuleairParticuliers.clearLayers();
        changeNebuleAir();
      }
    }

    if (document.querySelector("#checkbox_sensor_community").checked) {
      document.querySelector("#checkbox_sensor_community").checked = false;
      map.removeLayer(sensorCommunity);
      openToast(
        "Pas de données à intervalle 1 jour pour les capteurs Sensor.Community"
      );
    }

    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      document.querySelector(
        "#checkbox_micro_stationsAtmoSud"
      ).checked = false;
      map.removeLayer(stationsMicroAtmoSud);
      openToast(
        "Pas de données à intervalles 1 jour pour les microstations AtmoSud"
      );
    }

    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      if (
        apiFetchAtmoSudRef.timespan != 1440 ||
        apiFetchAtmoSudRef.data.length == 0 ||
        (apiFetchAtmoSudRef.data.length != 0 &&
          Date.now() - apiFetchAtmoSudRef.timestamp > 1440 * 60 * 1000)
      ) {
        stationsRefAtmoSud.clearLayers();
        loadStationRefAtmo();
      } else {
        stationsRefAtmoSud.clearLayers();
        changeStationRefAtmo();
      }
    }

    if (document.querySelector("#checkbox_purpleAir").checked) {
      if (
        apiFetchPurpleAir.timespan != 1440 ||
        apiFetchPurpleAir.data.length == 0 ||
        (apiFetchPurpleAir.data.length != 0 &&
          Date.now() - apiFetchPurpleAir.timestamp > 15 * 60 * 1000)
      ) {
        purpleAir.clearLayers();
        loadPurpleAir();
      } else {
        purpleAir.clearLayers();
        changePurpleAir();
      }
    }

    if (document.querySelector("#checkbox_wind").checked) {
      document.querySelector("#checkbox_wind").checked = false;
      map.removeLayer(velocityLayer);
      openToast(
        "La modélisation des vents présente des observations horaires."
      );
    }

    if (document.querySelector("#checkbox_modelisationPMAtmoSud").checked) {
      document.querySelector(
        "#checkbox_modelisationPMAtmoSud"
      ).checked = false;
      map.removeLayer(modelisationPMAtmoSud);
      openToast(
        "La modélisation des particules fines présente des observations horaires."
      );
    }

    if (
      document.querySelector("#checkbox_modelisationICAIRAtmoSud").checked
    ) {
      document.querySelector(
        "#checkbox_modelisationICAIRAtmoSud"
      ).checked = false;
      map.removeLayer(modelisationICAIRAtmoSud);
      openToast(
        "La modélisation ICAIRh présente des observations horaires."
      );
    }
    setQueryString();
  }

  //Common function to set the css of the buttons after clicks 
  function buttonsSwitcher(hours, timespan, modal) {
    console.log(hours);
    console.log(timespan);

    if (!modal) {
      switch (hours) {
        case 1:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 3:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 24:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 48:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 168:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 720:
          document
            .getElementById("button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          break;
      }

      switch (timespan) {
        case 2:
          document
            .getElementById("button2m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 15:
          document
            .getElementById("button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button15m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 60:
          document
            .getElementById("button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button60m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 1440:
          document
            .getElementById("button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("button1440m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          break;
      }
    } else {
      switch (hours) {
        case 1:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 3:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 24:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 48:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 168:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 720:
          document
            .getElementById("modal_button1h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button3h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button24h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button48h")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1s")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          break;
      }

      switch (timespan) {
        case 2:
          document
            .getElementById("modal_button2m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 15:
          document
            .getElementById("modal_button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button15m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 60:
          document
            .getElementById("modal_button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button60m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          document
            .getElementById("modal_button1440m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          break;
        case 1440:
          document
            .getElementById("modal_button2m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button15m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button60m")
            .children[0].classList.replace(
              "btn-secondary",
              "btn-outline-secondary"
            );
          document
            .getElementById("modal_button1440m")
            .children[0].classList.replace(
              "btn-outline-secondary",
              "btn-secondary"
            );
          break;
      }
    }
  }

//Bootstrap functions

  function openToast(message) {
    let toastDiv = document.getElementById("messageToast");
    document.getElementById("message").innerText = message;
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastDiv);
    console.log("Showing message toast");
    toastBootstrap.show();
  }
  
  function closeToast() {
    let toastDiv = document.getElementById("messageToast");
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastDiv);
    console.log("Hiding messgae toast");
    toastBootstrap.hide();
  }

  //Modal for Smartphones
  function modalCreator(type, data1, data2, data3, data4) {
    if (type == "nebuleair") {
      document.getElementById("modal_logo").src = "img/LogoNebuleAir.png";

      let id = data1.split("-")[1];
      document.getElementById("modal_sensorid").innerHTML =
        "nebuleair-" + id;

      switch (timespanLower) {
        case 2:
          timeLength = 3;
          break;
        case 15:
          timeLength = 24;
          break;
        case 60:
          timeLength = 48;
          break;
        case 1440:
          timeLength = 168;
          break;
      }

      load1NebuleAirModal(id, timeLength, timespanLower);
      document.getElementById("modal_chartSensor").style.display = "none";
      document.getElementById("modal_chartSensor2").style.display = "block";
      document.getElementById("modal_button1h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',1," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("modal_button3h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',3," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">3h</button>';
      document.getElementById("modal_button24h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',24," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("modal_button48h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',48," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("modal_button1s").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',168," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("modal_button1m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',720," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("modal_button1a").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',8760," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 an</button>';
      document.getElementById("modal_button2m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLength +
        ',2,true)" class="btn btn-outline-secondary btn-sm">2m</button>';
      document.getElementById("modal_button15m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLength +
        ',15,true)" class="btn btn-outline-secondary btn-sm">15m</button>';
      document.getElementById("modal_button60m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLength +
        ',60,true)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("modal_button1440m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLength +
        ',1440,true)" class="btn btn-outline-secondary btn-sm">24h</button>';
      buttonsSwitcher(timeLength, timespanLower, true);

      if (timespanLower == 2 || timespanLower == 15) {
        document
          .getElementById("modal_button1a")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("modal_button1a")
          .children[0].removeAttribute("disabled");
      }

      if (timeLength == 8760) {
        document
          .getElementById("modal_button2m")
          .children[0].setAttribute("disabled", "");
        document
          .getElementById("modal_button15m")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("modal_button2m")
          .children[0].removeAttribute("disabled");
        document
          .getElementById("modal_button15m")
          .children[0].removeAttribute("disabled");
      }

      document.getElementById("modal_lastseen").innerText =
        "Dernière mesure effectuée : " + data2;

      if (data3 != -1) {
        document.getElementById("modal_wifilevel").innerText =
          "Qualité connexion WIFI : " + data3 + "%";
      } else if (data3 == -1 && type != "sensorcommunity") {
        //document.getElementById("modal_wifilevel").innerText = "Capteur déconnecté";
        document.getElementById("modal_wifilevel").innerText = "";
      } else {
        document.getElementById("modal_wifilevel").innerText =
          "Capteur connecté";
      }
    }

    if (type == "sensorcommunity") {
      document.getElementById("modal_logo").src =
        "img/LogoSensorCommunity.png";
      let id = data1;
      document.getElementById("modal_sensorid").innerHTML =
        "Sensor.Community-" + id;
      document.getElementById("modal_chartSensor").style.display = "block";
      document.getElementById("modal_chartSensor2").style.display = "none";
      document.getElementById("modal_chartSensor").src =
        "https://api-rrd.madavi.de:3000/grafana/d-solo/000000004/single-sensor-view-for-map?orgId=1&var-node=" +
        id +
        "&panelId=2";
      document.getElementById("modal_button1h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\',1)" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("modal_button3h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\', 3)" class="btn btn-outline-secondary btn-sm" disabled>3h</button>';
      document.getElementById("modal_button24h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\', 24)" class="btn btn-secondary btn-sm">24h</button>';
      document.getElementById("modal_button48h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\', 48)" class="btn btn-outline-secondary btn-sm" disabled>48h</button>';
      document.getElementById("modal_button1s").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\', 168)" class="btn btn-outline-secondary btn-sm" disabled>1 semaine</button>';
      document.getElementById("modal_button1m").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        '\', 720)" class="btn btn-outline-secondary btn-sm" disabled>1 mois</button>';
      document.getElementById("modal_button1a").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        "',8760," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 an</button>';
      document.getElementById("modal_button2m").innerHTML =
        '<button type="button" class="btn btn-secondary btn-sm">2m</button>';
      document.getElementById("modal_button15m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>15m</button>';
      document.getElementById("modal_button60m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("modal_button1440m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>24h</button>';
      document.getElementById("modal_lastseen").innerText =
        "Dernière mesure effectuée : " + data2;
      if (data3 != -1) {
        document.getElementById("modal_wifilevel").innerText =
          "Qualité connexion WIFI : " + data3 + "%";
      } else if (data3 == -1 && type != "sensorcommunity") {
        //document.getElementById("modal_wifilevel").innerText = "Capteur déconnecté";
        document.getElementById("modal_wifilevel").innerText = "";
      } else {
        document.getElementById("modal_wifilevel").innerText =
          "Capteur connecté";
      }
    }

    if (type == "atmosudmicro") {
    }

    if (type == "atmosudref") {
      document.getElementById("modal_logo").src = "img/LogoAtmoSud.png";
      let id = data1;
      let nom = data4;
      document.getElementById("modal_sensorid").innerHTML =
        "Station AtmoSud-" + nom;
      document.getElementById("modal_sensorid").onclick = function () {
        window.open(
          "https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=" +
            data1,
          "_blank"
        );
      };

      switch (timespanLower) {
        case 2:
          timeLength = 3;
          break;
        case 15:
          timeLength = 24;
          break;
        case 60:
          timeLength = 48;
          break;
        case 1440:
          timeLength = 168;
          break;
      }

      load1RefAtmoModal(id, timeLength, timespanLower);
      document.getElementById("modal_chartSensor").style.display = "none";
      document.getElementById("modal_chartSensor2").style.display = "block";
      document.getElementById("modal_button1h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 1," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("modal_button3h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 3," +
        timespanLower +
        ',true)" class="btn btn-secondary btn-sm">3h</button>';
      document.getElementById("modal_button24h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 24," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("modal_button48h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 48," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("modal_button1s").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 168," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("modal_button1m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 720)," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("modal_button1a").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "',8760," +
        timespanLower +
        ',true)" class="btn btn-outline-secondary btn-sm">1 an</button>';
      document.getElementById("modal_button2m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
      document.getElementById("modal_button15m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLength +
        ',15,true)" class="btn btn-outline-secondary btn-sm">15m</button>';
      document.getElementById("modal_button60m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLength +
        ',60,true)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("modal_button1440m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLength +
        ',1440,true)" class="btn btn-outline-secondary btn-sm">24h</button>';
      buttonsSwitcher(timeLength, timespanLower, true);

      if (timespanLower == 2 || timespanLower == 15) {
        document
          .getElementById("modal_button1a")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("modal_button1a")
          .children[0].removeAttribute("disabled");
      }

      if (timeLength == 8760) {
        document
          .getElementById("modal_button2m")
          .children[0].setAttribute("disabled", "");
        document
          .getElementById("modal_button15m")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("modal_button2m")
          .children[0].removeAttribute("disabled");
        document
          .getElementById("modal_button15m")
          .children[0].removeAttribute("disabled");
      }

      document.getElementById("modal_lastseen").innerText =
        "Dernière mesure effectuée : " + data2;

      if (data3 != -1) {
        document.getElementById("modal_wifilevel").innerText =
          "Qualité connexion WIFI : " + data3 + "%";
      } else if (data3 == -1 && type != "sensorcommunity") {
        //document.getElementById("modal_wifilevel").innerText = "Capteur déconnecté";
        document.getElementById("modal_wifilevel").innerText = "";
      } else {
        document.getElementById("modal_wifilevel").innerText =
          "Capteur connecté";
      }
    }

    if (type == "purpleair") {
      document.getElementById("modal_logo").src = "img/LogoPurpleAir.png";
      let id = data1;
      document.getElementById("modal_sensorid").innerHTML =
        "PurpleAir-" + id;
      document.getElementById("modal_chartSensor").style.display = "none";
      document.getElementById("modal_chartSensor2").style.display = "block";

      console.log("Create Empty Amcharts");
      if (root4 != undefined) {
        console.log("DISPOSE");
        root4.dispose();
      }
      setTimeout(function () {
        am5.ready(function () {
          root4 = am5.Root.new("modal_chartSensor2");
          root4.setThemes([am5themes_Animated.new(root4)]);

          var chart4 = root4.container.children.push(
            am5xy.XYChart.new(root4, {
              panX: true,
              panY: true,
              wheelX: "panX",
              wheelY: "zoomX",
              maxTooltipDistance: 0,
              pinchZoomX: true,
            })
          );

          // Create axes
          // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
          var xAxis = chart4.xAxes.push(
            am5xy.DateAxis.new(root4, {
              maxDeviation: 0.2,
              baseInterval: {
                timeUnit: "minute",
                count: 1,
              },
              renderer: am5xy.AxisRendererX.new(root4, {}),
              tooltip: am5.Tooltip.new(root4, {}),
            })
          );

          var yAxis = chart4.yAxes.push(
            am5xy.ValueAxis.new(root4, {
              renderer: am5xy.AxisRendererY.new(root4, {}),
            })
          );

          var modal = am5.Modal.new(root4, {
            content: "L'API PurpleAir n'est pas ouverte.",
          });

          modal.open();

          var legend = chart4.bottomAxesContainer.children.push(
            am5.Legend.new(root4, {
              width: 400,
              height: am5.percent(20),
              layout: root4.horizontalLayout,
            })
          );

          // When legend item container is hovered, dim all the series except the hovered one
          legend.itemContainers.template.events.on(
            "pointerover",
            function (e) {
              var itemContainer = e.target;

              // As series list is data of a legend, dataContext is series
              var series = itemContainer.dataItem.dataContext;

              chart4.series.each(function (chartSeries) {
                if (chartSeries != series) {
                  chartSeries.strokes.template.setAll({
                    strokeOpacity: 0.15,
                    stroke: am5.color(0x000000),
                  });
                } else {
                  chartSeries.strokes.template.setAll({
                    strokeWidth: 3,
                  });
                }
              });
            }
          );

          // When legend item container is unhovered, make all series as they are
          legend.itemContainers.template.events.on(
            "pointerout",
            function (e) {
              var itemContainer = e.target;
              var series = itemContainer.dataItem.dataContext;

              chart4.series.each(function (chartSeries) {
                chartSeries.strokes.template.setAll({
                  strokeOpacity: 1,
                  strokeWidth: 1,
                  stroke: chartSeries.get("fill"),
                });
              });
            }
          );

          legend.itemContainers.template.set("width", am5.p100);
          legend.valueLabels.template.setAll({
            width: am5.p100,
            textAlign: "right",
          });

          // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
          legend.data.setAll(chart4.series.values);

          chart4.children.unshift(
            am5.Label.new(root4, {
              fontSize: 14,
              textAlign: "center",
              x: am5.percent(50),
              centerX: am5.percent(50),
            })
          );

          var exporting = am5plugins_exporting.Exporting.new(root4, {
            menu: am5plugins_exporting.ExportingMenu.new(root4, {}),
            dataSource: null,
          });

          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          chart4.appear(1000, 100);
        });
      }, 1000); // end am5.ready()

      document.getElementById("modal_button1h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',1," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("modal_button3h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',3," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>3h</button>';
      document.getElementById("modal_button24h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',24," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>24h</button>';
      document.getElementById("modal_button48h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',48," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>48h</button>';
      document.getElementById("modal_button1s").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',168," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 semaine</button>';
      document.getElementById("modal_button1m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',720," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 mois</button>';
      document.getElementById("modal_button1a").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',8760," +
        timespanLower +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 an</button>';
      document.getElementById("modal_button2m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLength +
        ',2)" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
      document.getElementById("modal_button15m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLength +
        ',15)" class="btn btn-outline-secondary btn-sm" disabled>15m</button>';
      document.getElementById("modal_button60m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLength +
        ',60)" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("modal_button1440m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLength +
        ',1440)" class="btn btn-outline-secondary btn-sm" disabled>24h</button>';

      //         load1PurpleAir(id,timeLengthGraph,timespanGraph);
      //         document.getElementById("modal_chartSensor").style.display = 'none';
      //         document.getElementById("modal_chartSensor2").style.display = 'block';
      //         document.getElementById("modal_button1h").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',1,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">1h</button>';
      //         document.getElementById("modal_button3h").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',3,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">3h</button>';
      //         document.getElementById("modal_button24h").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',24,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">24h</button>';
      //         document.getElementById("modal_button48h").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',48,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">48h</button>';
      //         document.getElementById("modal_button1s").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',168,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      //         document.getElementById("modal_button1m").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',720,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      //         document.getElementById("modal_button1a").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',8760,' + timespanLower + ')" class="btn btn-outline-secondary btn-sm">1 an</button>';
      //         document.getElementById("modal_button2m").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',' + timeLength + ',2)" class="btn btn-outline-secondary btn-sm">2m</button>';
      //         document.getElementById("modal_button15m").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',' + timeLength + ',15)" class="btn btn-outline-secondary btn-sm">15m</button>';
      //         document.getElementById("modal_button60m").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',' + timeLength + ',60)" class="btn btn-outline-secondary btn-sm">1h</button>';
      //         document.getElementById("modal_button1440m").innerHTML = '<button type="button" onclick="chooseTimePurpleAir(\'' + id + '\',' + timeLength + ',1440)" class="btn btn-outline-secondary btn-sm">24h</button>';
      //         buttonsSwitcher(timeLength,timespanLower,true);

      //        if(timespanLower == 2 || timespanLower == 15){
      //       document.getElementById("button1a").children[0].setAttribute("disabled","");
      //     }else{
      //       document.getElementById("button1a").children[0].removeAttribute("disabled");
      //     }

      //     if(timeLength == 8760){
      //       document.getElementById("button2m").children[0].setAttribute("disabled","");
      //       document.getElementById("button15m").children[0].setAttribute("disabled","");
      //     }else{
      //       document.getElementById("button2m").children[0].removeAttribute("disabled");
      //       document.getElementById("button15m").children[0].removeAttribute("disabled");
      //     }

      document.getElementById("modal_lastseen").innerText =
        "Dernière mesure effectuée : " + data2;

      if (data3 != -1) {
        document.getElementById("modal_wifilevel").innerText =
          "Qualité connexion WIFI : " + data3 + "%";
      } else if (data3 == -1 && type != "sensorcommunity") {
        //   document.getElementById("modal_wifilevel").innerText = "Capteur déconnecté";
        document.getElementById("modal_wifilevel").innerText = "";
      } else {
        document.getElementById("modal_wifilevel").innerText =
          "Capteur connecté";
      }
    }
  }


  //SidePanel for Desktop Computer
  function OpenSidePanel(sensor) {
    const targetDiv = document.getElementById("sidePanel");
    console.log(sensor);
    targetDiv.style.display = "block";
    document.getElementById("title_deviceName").innerHTML = sensor;

    switch (timespanLower) {
      case 2:
        var tempo = " à 2 minutes ";
        break;
      case 15:
        var tempo = " quart-horaires ";
        break;
      case 60:
        var tempo = " horaires ";
        break;
      case 1440:
        var tempo = " journalières ";
        break;
    }

    document.getElementById("card-title").innerText =
      "Evolution des concentrations" +
      tempo +
      "en particules fines (µg/m3)";

    var timespanGraph = timespanLower;
    var timeLengthGraph;

    switch (timespanLower) {
      case 2:
        timeLengthGraph = 3;
        break;
      case 15:
        timeLengthGraph = 24;
        break;
      case 60:
        timeLengthGraph = 48;
        break;
      case 1440:
        timeLengthGraph = 168;
        break;
    }

    if (sensor.includes("nebuleair")) {
      let id = sensor.split("-")[1];
      load1NebuleAir(id, timeLengthGraph, timespanGraph);
      document.getElementById("chartSensor").style.display = "none";
      document.getElementById("chartSensor2").style.display = "block";
      document.getElementById("button1h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',1," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button3h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',3," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">3h</button>';
      document.getElementById("button24h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',24," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("button48h").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',48," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("button1s").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',168," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("button1m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',720," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("button1a").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "',8760," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 an</button>';
      document.getElementById("button2m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',2,false)" class="btn btn-outline-secondary btn-sm">2m</button>';
      document.getElementById("button15m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',15,false)" class="btn btn-outline-secondary btn-sm">15m</button>';
      document.getElementById("button60m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',60,false)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button1440m").innerHTML =
        '<button type="button" onclick="chooseTimeNebuleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',1440,false)" class="btn btn-outline-secondary btn-sm">24h</button>';

      buttonsSwitcher(timeLengthGraph, timespanGraph, false);

      if (timespanGraph == 2 || timespanGraph == 15) {
        document
          .getElementById("button1a")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button1a")
          .children[0].removeAttribute("disabled");
      }

      if (timeLengthGraph == 8760) {
        document
          .getElementById("button2m")
          .children[0].setAttribute("disabled", "");
        document
          .getElementById("button15m")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button2m")
          .children[0].removeAttribute("disabled");
        document
          .getElementById("button15m")
          .children[0].removeAttribute("disabled");
      }
    }

    if (sensor.includes("Sensor.Community")) {
      let id = sensor.split("-")[1];
      document.getElementById("chartSensor").style.display = "block";
      document.getElementById("chartSensor2").style.display = "none";
      document.getElementById("chartSensor").src =
        "https://api-rrd.madavi.de:3000/grafana/d-solo/000000004/single-sensor-view-for-map?orgId=1&var-node=" +
        id +
        "&panelId=2";
      document.getElementById("button1h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\',1)" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("button3h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\', 3)" class="btn btn-outline-secondary btn-sm" disabled>3h</button>';
      document.getElementById("button24h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\', 24)" class="btn btn-secondary btn-sm">24h</button>';
      document.getElementById("button48h").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\', 48)" class="btn btn-outline-secondary btn-sm" disabled>48h</button>';
      document.getElementById("button1s").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\', 168)" class="btn btn-outline-secondary btn-sm" disabled>1 semaine</button>';
      document.getElementById("button1m").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        sensor +
        '\', 720)" class="btn btn-outline-secondary btn-sm" disabled>1 mois</button>';
      document.getElementById("button1a").innerHTML =
        '<button type="button" onclick="chooseTimeSensorCommunity(\'' +
        id +
        "',8760," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 an</button>';
      document.getElementById("button2m").innerHTML =
        '<button type="button" class="btn btn-secondary btn-sm">2m</button>';
      document.getElementById("button15m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>15m</button>';
      document.getElementById("button60m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("button1440m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>24h</button>';
    }

    if (sensor.includes("microstationAtmoSud")) {
      var id = sensor.split("-")[1];
      load1MicroAtmo(id, timeLength);
      document.getElementById("chartSensor").style.display = "none";
      document.getElementById("chartSensor2").style.display = "block";
      document.getElementById("button1h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\',1)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button3h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\', 3)" class="btn btn-secondary btn-sm">3h</button>';
      document.getElementById("button24h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\', 24)" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("button48h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\', 48)" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("button1s").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\', 168)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("button1m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        '\', 720)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("button1a").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoMicro(\'' +
        id +
        "',8760," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm" disabled>1 an</button>';
      document.getElementById("button2m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
      document.getElementById("button15m").innerHTML =
        '<button type="button" class="btn btn-secondary btn-sm">15m</button>';
      document.getElementById("button60m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>1h</button>';
      document.getElementById("button1440m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>24h</button>';
    }

    if (sensor.includes("stationRefAtmoSud")) {
      var id = sensor.split("-")[1];
      load1RefAtmo(id, timeLengthGraph, timespanGraph);
      document.getElementById("chartSensor").style.display = "none";
      document.getElementById("chartSensor2").style.display = "block";
      document.getElementById("button1h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 1," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button3h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 3," +
        timespanGraph +
        ',false)" class="btn btn-secondary btn-sm">3h</button>';
      document.getElementById("button24h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 24," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("button48h").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 48," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("button1s").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 168," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("button1m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "', 720)," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("button1a").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "',8760," +
        timespanGraph +
        ',false)" class="btn btn-outline-secondary btn-sm">1 an</button>';
      document.getElementById("button2m").innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
      document.getElementById("button15m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',15,false)" class="btn btn-outline-secondary btn-sm">15m</button>';
      document.getElementById("button60m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',60,false)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button1440m").innerHTML =
        '<button type="button" onclick="chooseTimeAtmoRef(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',1440,false)" class="btn btn-outline-secondary btn-sm">24h</button>';
      buttonsSwitcher(timeLengthGraph, timespanGraph, false);

      if (timespanGraph == 2 || timespanGraph == 15) {
        document
          .getElementById("button1a")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button1a")
          .children[0].removeAttribute("disabled");
      }

      if (timeLengthGraph == 8760) {
        document
          .getElementById("button2m")
          .children[0].setAttribute("disabled", "");
        document
          .getElementById("button15m")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button2m")
          .children[0].removeAttribute("disabled");
        document
          .getElementById("button15m")
          .children[0].removeAttribute("disabled");
      }
    }

    if (sensor.includes("purpleair")) {
      let id = sensor.split("-")[1];
      load1PurpleAir(id, timeLengthGraph, timespanGraph);
      document.getElementById("chartSensor").style.display = "none";
      document.getElementById("chartSensor2").style.display = "block";
      document.getElementById("button1h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',1," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button3h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',3," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">3h</button>';
      document.getElementById("button24h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',24," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">24h</button>';
      document.getElementById("button48h").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',48," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">48h</button>';
      document.getElementById("button1s").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',168," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
      document.getElementById("button1m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',720," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">1 mois</button>';
      document.getElementById("button1a").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "',8760," +
        timespanGraph +
        ')" class="btn btn-outline-secondary btn-sm">1 an</button>';
      document.getElementById("button2m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',2)" class="btn btn-outline-secondary btn-sm">2m</button>';
      document.getElementById("button15m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',15)" class="btn btn-outline-secondary btn-sm">15m</button>';
      document.getElementById("button60m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',60)" class="btn btn-outline-secondary btn-sm">1h</button>';
      document.getElementById("button1440m").innerHTML =
        '<button type="button" onclick="chooseTimePurpleAir(\'' +
        id +
        "'," +
        timeLengthGraph +
        ',1440)" class="btn btn-outline-secondary btn-sm">24h</button>';
      buttonsSwitcher(timeLengthGraph, timespanGraph, false);

      if (timespanGraph == 2 || timespanGraph == 15) {
        document
          .getElementById("button1a")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button1a")
          .children[0].removeAttribute("disabled");
      }

      if (timeLengthGraph == 8760) {
        document
          .getElementById("button2m")
          .children[0].setAttribute("disabled", "");
        document
          .getElementById("button15m")
          .children[0].setAttribute("disabled", "");
      } else {
        document
          .getElementById("button2m")
          .children[0].removeAttribute("disabled");
        document
          .getElementById("button15m")
          .children[0].removeAttribute("disabled");
      }
    }
  }

  function CloseSidePanel() {
    const targetDiv = document.getElementById("sidePanel");
    targetDiv.style.display = "none";
  }

  //URL options
  function setQueryString() {
    let stateObj = {};
    let new_path = window.location.pathname + "?";

    switch (timespanLower) {
      case 2:
        new_path += "minutes=2&";
        break;
      case 15:
        new_path += "minutes=15&";
        break;
      case 60:
        new_path += "minutes=60&";
        break;
      case 1440:
        new_path += "minutes=1440&";
        break;
    }

    switch (compoundUpper) {
      case "PM1":
        new_path += "concentration=PM1";
        break;
      case "PM25":
        new_path += "concentration=PM25";
        break;
      case "PM10":
        new_path += "concentration=PM10";
        break;
    }

    let displayString = "";

    if (
      document.querySelector("#checkbox_micro_stationsParticuliers").checked
    ) {
      displayString += "nebuleair,";
    }
    if (document.querySelector("#checkbox_sensor_community").checked) {
      displayString += "sensorcommunity,";
    }
    if (document.querySelector("#checkbox_purpleAir").checked) {
      displayString += "purpleair,";
    }
    if (document.querySelector("#checkbox_micro_stationsAtmoSud").checked) {
      displayString += "atmosudmicro,";
    }
    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      displayString += "atmosudref,";
    }
    // if(document.querySelector("#checkbox_modelisationPMAtmoSud").checked){displayString += "sensorcommunity,"}
    // if(document.querySelector("#checkbox_modelisationICAIRAtmoSud").checked){displayString += "sensorcommunity,"}
    // if(document.querySelector("#checkbox_wind").checked){displayString += "sensorcommunity,"}

    new_path += "&affichage=" + displayString;

    new_path = new_path + location.hash;
    console.log(new_path);
    history.pushState(stateObj, document.title, new_path);
  }
  
  //Screenshot event (deactivated) => Leaflet Tiles should be on the same server
  function screenShot() {
    console.log("Screenshot!");

    html2canvas(document.body, {
      logging: false,
      useCORS: true, //REVOIR LES OPTIONS
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        window.saveAs(blob, "screenshot.png");
      });
    });

    // html2canvas(document.body,{
    //     onrendered: function(canvas){

    //         canvas.toBlob(function(blob) {
    //         window.saveAs(blob, "screenshot.png");
    //     });

    //     }
    // });

    // html2canvas(document.body).then(function(canvas) {
    // var link =  document.createElement("a");
    // link.setAttribute('download', 'MintyPaper.png');
    // link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    // link.click();
    // });
  }


  //Time / Date counters
  function timeDateCounter(timestamp) {
    var timestamp_UTC;
    // const UTCoffset = -new Date().getTimezoneOffset() / 60;
    // const DST = new Date().isDstObserved();
    // console.log(UTCoffset);
    // console.log(DST);

    //console.log(timestamp.replace(' ','T') + '.000Z');
    var isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" &&
            window["safari"].pushNotification)
      );
    // console.log(isSafari);

    if (isSafari) {
      if (timestamp != null) {
        if (typeof timestamp == "string") {
          if (!timestamp.includes("T")) {
            timestamp_UTC = new Date(
              timestamp.replace(" ", "T") + "+00:00"
            );
          } else {
            timestamp_UTC = new Date(timestamp);
          }
        } else {
          timestamp_UTC = new Date(timestamp);
        }
      } else {
        return " pas de donnée disponible";
      }
    } else {
      if (timestamp != null) {
        if (typeof timestamp == "string") {
          if (!timestamp.includes("T")) {
            timestamp_UTC = new Date(
              timestamp.replace(" ", "T") + "+00:00"
            );
          } else {
            timestamp_UTC = new Date(timestamp);
          }
        } else {
          timestamp_UTC = new Date(timestamp);
        }
      } else {
        return " pas de donnée disponible";
      }
    }

    // console.log(timestamp_UTC);
    const now = new Date(Date.now());

    // let difference = now.getTime() - timestamp_UTC.getTime();

    let difference = Math.floor((now - timestamp_UTC) / 86400000);
    // console.log(difference);
    // console.log(now - timestamp_UTC);

    var date_texte = "";
    let horaire_texte = "";

    switch (difference) {
      case 0:
        if (now.getDay() == timestamp_UTC.getDay()) {
          date_texte = " aujourd'hui";
        } else {
          date_texte = " hier";
        }
        break;
      case 1:
        date_texte = " hier";
        break;
      case 2:
        date_texte = " avant-hier";
        break;
      default:
        date_texte += "il y a " + String(difference) + " jours";
      //     if(timestamp_UTC.getDate()< 10){
      //     date_texte += "0";
      //     date_texte += timestamp_UTC.getDate();
      //   }else{
      //     date_texte += timestamp_UTC.getDate();
      //   }
      //   date_texte += "/";
      //   if((timestamp_UTC.getMonth()+1)< 10){
      //     date_texte += "0";
      //     date_texte += (timestamp_UTC.getMonth()+1);
      //   }else{
      //     date_texte += (timestamp_UTC.getMonth()+1);
      //   }
      //   date_texte += "/";
      //   date_texte += timestamp_UTC.getFullYear();
    }

    //horaire
    if (timestamp_UTC.getHours() < 10) {
      horaire_texte += "0";
      horaire_texte += timestamp_UTC.getHours();
    } else {
      horaire_texte += timestamp_UTC.getHours();
    }
    horaire_texte += "h";
    if (timestamp_UTC.getMinutes() < 10) {
      horaire_texte += "0";
      horaire_texte += timestamp_UTC.getMinutes();
    } else {
      horaire_texte += timestamp_UTC.getMinutes();
    }

    return date_texte + " à " + horaire_texte;
  }

  function timeDateCounter2(timestamp, timestamp2) {
    var timestamp_UTC;
    var isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" &&
            window["safari"].pushNotification)
      );
    // console.log(isSafari);

    if (isSafari) {
      if (timestamp != null) {
        if (typeof timestamp == "string") {
          if (!timestamp.includes("T")) {
            timestamp_UTC = new Date(
              timestamp.replace(" ", "T") + "+00:00"
            );
          } else {
            timestamp_UTC = new Date(timestamp);
          }
        } else {
          timestamp_UTC = new Date(timestamp);
        }
      } else {
        if (timestamp2 != null) {
          if (typeof timestamp2 == "string") {
            if (!timestamp2.includes("T")) {
              timestamp_UTC = new Date(
                timestamp2.replace(" ", "T") + "+00:00"
              );
            } else {
              timestamp_UTC = new Date(timestamp2);
            }
          } else {
            timestamp_UTC = new Date(timestamp2);
          }
        } else {
          return " pas de donnée disponible";
        }
      }
    } else {
      if (timestamp != null) {
        if (typeof timestamp == "string") {
          if (!timestamp.includes("T")) {
            timestamp_UTC = new Date(
              timestamp.replace(" ", "T") + "+00:00"
            );
          } else {
            timestamp_UTC = new Date(timestamp);
          }
        } else {
          timestamp_UTC = new Date(timestamp);
        }
      } else {
        if (timestamp2 != null) {
          if (typeof timestamp2 == "string") {
            if (!timestamp2.includes("T")) {
              timestamp_UTC = new Date(
                timestamp2.replace(" ", "T") + "+00:00"
              );
            } else {
              timestamp_UTC = new Date(timestamp2);
            }
          } else {
            timestamp_UTC = new Date(timestamp2);
          }
        } else {
          return " pas de donnée disponible";
        }
      }
    }

    // console.log(timestamp_UTC);
    const now = new Date(Date.now());

    // let difference = now.getTime() - timestamp_UTC.getTime();

    let difference = Math.floor((now - timestamp_UTC) / 86400000);
    // console.log(difference);
    // console.log(now - timestamp_UTC);

    var date_texte = "";
    let horaire_texte = "";

    switch (difference) {
      case 0:
        if (now.getDay() == timestamp_UTC.getDay()) {
          date_texte = " aujourd'hui";
        } else {
          date_texte = " hier";
        }
        break;
      case 1:
        date_texte = " hier";
        break;
      case 2:
        date_texte = " avant-hier";
        break;
      default:
        date_texte += "il y a " + String(difference) + " jours";
      //     if(timestamp_UTC.getDate()< 10){
      //     date_texte += "0";
      //     date_texte += timestamp_UTC.getDate();
      //   }else{
      //     date_texte += timestamp_UTC.getDate();
      //   }
      //   date_texte += "/";
      //   if((timestamp_UTC.getMonth()+1)< 10){
      //     date_texte += "0";
      //     date_texte += (timestamp_UTC.getMonth()+1);
      //   }else{
      //     date_texte += (timestamp_UTC.getMonth()+1);
      //   }
      //   date_texte += "/";
      //   date_texte += timestamp_UTC.getFullYear();
    }

    //horaire
    if (timestamp_UTC.getHours() < 10) {
      horaire_texte += "0";
      horaire_texte += timestamp_UTC.getHours();
    } else {
      horaire_texte += timestamp_UTC.getHours();
    }
    horaire_texte += "h";
    if (timestamp_UTC.getMinutes() < 10) {
      horaire_texte += "0";
      horaire_texte += timestamp_UTC.getMinutes();
    } else {
      horaire_texte += timestamp_UTC.getMinutes();
    }

    return date_texte + " à " + horaire_texte;
  }

