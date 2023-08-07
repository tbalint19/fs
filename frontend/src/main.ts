import "./style.css";

const sum = (x: number, y: number): number => {
  return x + y
}

const myButton = document.getElementById("load-button") as HTMLButtonElement
// or...
// const myButton = document.getElementsByTagName("button")
// const button = document.querySelector("#load-button")
// ... document. -> help

const myInput1 = document.getElementById("elso") as HTMLInputElement
const myInput2 = document.getElementById("masodik") as HTMLInputElement

myButton.addEventListener("click", (event) => {

  //  event.clientX

  const inputVal1 = myInput1.value
  const inputVal2 = myInput2.value
  const result = sum(+inputVal1, +inputVal2)
  const appDiv = document.getElementById("app") as HTMLDivElement
  // appDiv.innerHTML = '<p style="color:red" id="14" class="mas">' + result + "</p>"
  appDiv.innerHTML = `
    <p style="color:red" id="14" class="mas">
      ${result}
    </p>
  `

  // or...

  const pElement = document.createElement("p")
  pElement.innerText = "" + result

  pElement.id = "1"
  pElement.addEventListener("click", () => {})

  appDiv.appendChild(pElement)
})

const sport = "foci"
const country = "magyarorszag"

//const url = "https://nemzetisport.hu?sport=" + sport + "&orszag=" + country
const url = `https://nemzetisport.hu?sport=${sport}&orszag=${country}`