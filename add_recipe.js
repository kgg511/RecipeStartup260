//add more ingredient lines when they push the button add_ingredient
//submit the recipe to the database when they hit submit


function add_ingredient_line(){
    //create a new input element
    const rowElement = document.createElement("div");
    rowElement.setAttribute("class", "row");

    const colElement1 = document.createElement("div");
    colElement1.setAttribute("class", "col");
    const inputElement1 = document.createElement("input");
    inputElement1.setAttribute("type", "text");
    inputElement1.setAttribute("class", "form-control");
    inputElement1.setAttribute("placeholder", "ingredient (flour)");
    colElement1.appendChild(inputElement1);

    const colElement2 = document.createElement("div");
    colElement2.setAttribute("class", "col");
    const inputElement2 = document.createElement("input");
    inputElement2.setAttribute("type", "text");
    inputElement2.setAttribute("class", "form-control");
    inputElement2.setAttribute("placeholder", "amount (1/2 cups)");
    colElement2.appendChild(inputElement2);

    rowElement.appendChild(colElement1);
    rowElement.appendChild(colElement2);

    const ingredientList = document.querySelector("#ingredientList");
    ingredientList.appendChild(rowElement);
//<Section class = "ingredients">
}
/* <div class="row">
            <div class="col">
              <input type="text" class="form-control" placeholder="ingredient (flour)">
            </div>
            <div class="col">
              <input type="text" class="form-control" placeholder="amount (1/2 cups)">
            </div>
          </div> */


          function generateRows(data, tableElement) {
            data.forEach((dataRow) => {
              const rowElement = document.createElement("tr");
              tableElement.appendChild(rowElement);
              for (const [, value] of Object.entries(dataRow)) {
                const cellElement = document.createElement("td");
                rowElement.appendChild(cellElement);
                const textNode = document.createTextNode(value);
                cellElement.appendChild(textNode);
              }
            });
          }