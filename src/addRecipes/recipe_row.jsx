import React from 'react';

export function RecipeRow({index, onChange}) { //onChange function, when it changes here it calls parent function??
    return (    
        <div className="row">
            <div className="col">
              <input type="text" id = "ingredientName" className="form-control" placeholder="ingredient (flour)" onChange={(e) => onChange({index}, "name", e.target.value)} required/>
            </div>
            <div className="col">
              <input type="text" id = "ingredientAmount" className="form-control" placeholder="amount (1/2 cups)" onChange={(e) => onChange({index}, "amount", e.target.value)} required/>
            </div>
          </div>
    );

}




                                                                    //handleRowEdit(rowIndex, columnName, newValue)