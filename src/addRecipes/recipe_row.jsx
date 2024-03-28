import React from 'react';

export function RecipeRow({onChange, key}) { //onChange function, when it changes here it calls parent function??

    return (
        <div key = {key} className="row">
            <div className="col">
              <input type="text" id = "ingredientName" className="form-control" placeholder="ingredient (flour)" onChange={(e) => onChange({ ...row, value: e.target.value })}required/>
            </div>
            <div className="col">
              <input type="text" id = "ingredientAmount" className="form-control" placeholder="amount (1/2 cups)" required/>
            </div>
          </div>
    );

}