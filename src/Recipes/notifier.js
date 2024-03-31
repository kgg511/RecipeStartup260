


class Notifier{
    handlers = [];

    constructor(){
        this._recipeChange = -1; //initialize to -1
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
            console.log("connected to websocket");
        };
        this.socket.onclose = (event) => {
            console.log("disconnected from websocket");
        };
        this.socket.onmessage = async (event) => {
            //the only message are makes. Take out the RecipeID and makes
            console.log(event);
            const msg = JSON.parse(await event.data.text());
            this.sendToCards(msg.RecipeID);
        }; //no it needs to call a method in the recipe card
    }

    setRecipeChange(RecipeID){
        this._recipeChange = RecipeID;
    }
    
    broadcast_makes(RecipeID, makes){
        const message = {
            "RecipeID": RecipeID,
            "makes": makes
        };
        this.socket.send(JSON.stringify(message));
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }
    
    removeHandler(handler) {
    this.handlers.filter((h) => h !== handler);
    }

    sendToCards(RecipeID) { //each handler is a function to a recipeCard
        this.handlers.forEach((handler) => {
            handler(RecipeID);
        });
    }
    
    

}


const ws = new Notifier();
export { ws };