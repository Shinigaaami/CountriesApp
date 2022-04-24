const randomCountryDiv = document.getElementById("randomCountryContainer");
const btnRandomCountry = randomCountryDiv.children[1];
const pAdvertising = randomCountryDiv.children[0];
const h1 = document.getElementsByTagName("h1")[0];

const style = document.createElement("style");

const getCountries = async function () {
  let countries = await new Promise((resolve, reject) => {
    resolve(fetch("https://restcountries.com/v3.1/all"));
    reject("Error man");
  });
  let data = await countries.json();
  return data;
};

const getBorderingCountry = async function (country) {
  let countryInfo = await new Promise((resolve, reject) => {
    resolve(fetch(`https://restcountries.com/v3.1/alpha/${country}`));
    reject("Error man");
  });
  let data = await countryInfo.json();
  return data;
};

btnRandomCountry.addEventListener("click", () => {
  if (
    !randomCountryDiv.classList.contains("showCountry") ||
    !h1.classList.contains("moveToBottom")
  )
    animateCountryLoad();

  getRandomCountry();

  async function getRandomCountry() {
    //Sinhrona radnja.... mora pre async await
    if (pAdvertising.style.opacity !== "0") pAdvertising.style.opacity = "0";

    let countries = await getCountries();
    let randomCountry = countries[getRandomNum()];
    let countryName = randomCountry.name.common;
    let countryFlag = randomCountry.flags.svg;
    let capital = randomCountry?.capital[0];
    let continent = randomCountry.continents[0];
    let memberOfUN = randomCountry.unMember ? "YES" : "NO";
    let borderingCountries = randomCountry?.borders;
    let languages = randomCountry.languages;
    let currency =
      randomCountry.currencies[Object.keys(randomCountry.currencies)[0]];

    let hasBordering = borderingCountries;
    if (borderingCountries) {
      console.log("ima bordering");
      // Imam niz promisa koji zelim istovremeno da runnam
      let promises = [];
      console.log(borderingCountries);
      borderingCountries.forEach((element) => {
        let promise = getBorderingCountry(element);
        promises.push(promise);
      });

      let allBorderingCountries = await Promise.all(promises)
        .then((req) => req)
        .catch((err) => console.log(err));

      //da mogu kasnije da pristupim...
      var borderingCountriesValues = [];
      allBorderingCountries.forEach((element) => {
        borderingCountriesValues.push([
          element[0].name.common,
          element[0].flags.svg,
        ]);
      });
    } else {
      console.log("no bordering");
    }
    console.log(randomCountry);

    if (pAdvertising.nextElementSibling.tagName === "DIV") {
      pAdvertising.nextElementSibling.innerHTML = getHTML(hasBordering, false);
    } else {
      pAdvertising.style.display = "none";
      pAdvertising.insertAdjacentHTML("afterend", getHTML(hasBordering));
    }

    function getHTML(hasBordering, firstTime = true) {
      let htmlBordering = "";
      if (hasBordering) {
        console.log(borderingCountriesValues);

        console.log(borderingCountriesValues.length);

        //Moram razmisliti da li i ime gradova da dodam u DOM

        for (const [x, y] of borderingCountriesValues) {
          htmlBordering += `
          <div>
            <img src='${y}' alt="no picture of bordering country"/>
            <!--<p>${x}</p>-->
          </div>
          `;
        }
        document.head.append(style);
        style.innerHTML = `
        .borderingCountries{
            display: grid;
            width: 100%;
            grid-template-columns: repeat(auto-fit,minmax(${
              100 / borderingCountriesValues.length
            }%,1fr));
        }
        .borderingCountries>div img{
              position: static !important;
                    object-fit: cover;
                    height:16.2vh !important;
        }
        .showCountry{
            // max-width: calc();
        }
        .borderingCountries>div:first-child>img{
          border-radius:0px 0px 0px 20px;
        }
        .borderingCountries>div:last-child>img{
          border-radius:0px 0px 20px 0px;
        }
        `;
      }

      if (firstTime)
        return `<div id="randomCountry">
    <img src="${countryFlag}" alt="no flag found" class="flag">
    <div id="randomCountryDetails">
        <p class="countryName">Name: <span>${countryName}</span></p>
        <p class="countryContinent">Continent: <span>${continent}</span></p>
        <p class="capital">Capital: <span>${capital}</span></p>
        <p class="unMember">In UN?: <span>${memberOfUN}</span></p>
        <div class="currencies">
          <p>Currency: <span>${currency.name}(${currency.symbol})</span></p>
        </div>
        <div class="languages">
        </div>
        <div class="borderingCountries">
        ${htmlBordering}
        </div>
    </div>
    </div>`;
      else
        return `
      <img src="${countryFlag}" alt="no flag found" class="flag">
      <div id="randomCountryDetails">
          <p class="countryName">Name: <span>${countryName}</span></p>
          <p class="countryContinent">Continent: <span>${continent}</span></p>
          <p class="capital">Capital: <span>${capital}</span></p>
          <p class="unMember">In UN?: <span>${memberOfUN}</span></p>
          <div class="currencies">
            <p>Currency: <span>${currency.name}(${currency.symbol})</span></p>
          </div>
          <div class="languages">
          </div>
          <div class="borderingCountries">
          ${htmlBordering}
          </div>
      </div>`;
    }
  }
});
function animateCountryLoad() {
  randomCountryDiv.classList.add("showCountry");
  h1.classList.add("moveToBottom");
}

function getRandomNum() {
  return Math.floor(Math.random() * 250 + 0);
}
