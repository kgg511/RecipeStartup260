import React from 'react';

export function RecipeCard(recipe) {

    return (
        <div className="card" style={{ width: "18rem" }}>
          <div style={{ alignItems: "flex-start" }}><a href="#" className="delete"><i className="fa-solid fa-x"></i></a></div>
          <div className="flip-card">
            <div><a href="#" className="delete"><i className="fa-solid fa-x"></i></a></div>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="card-img-top" src="media/chicken.JPG" alt="Recipe Image" />
                  <div className="card-body">
                    <h5 className="card-title">Cookies</h5>
                    <h6 className="card-subtitle mb-2 text-muted">FILLER (this delete/make button won't work)</h6>
                  </div>
                </div>
  
                <div className="flip-card-back">
                  <div className="card-body">
                    <h5 className="card-title">Cookies</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">6 cups flour</li>
                      <li className="list-group-item">2 cups sugar</li>
                      <li className="list-group-item">1 tsp salt</li>
                    </ul>
                    <hr />
                    <h6>Directions:</h6>
                    <div className="instructions">
                      <ol>
                        <li>Cream butter and sugar.</li>
                        <li>Sacrifice your first born child.</li>
                        <li>Put in oven.</li>
                      </ol>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div><button className="btn btn-primary"><i className="fa-solid fa-cookie"></i></button></div>
          <div><p>6</p></div>
        </div>
    );
}
