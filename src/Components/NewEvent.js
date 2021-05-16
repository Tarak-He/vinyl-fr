import React from "react"
import firebase from "firebase";

const NewEvent = () => {

    const handleSubmit = (e) => {

        e.preventDefault();

        const eventID = "e" + Date.now() * Math.floor(Math.random() * 1000)* Math.floor(Math.random() * 1000)

        let date = new Date();  
        let options = {  
            weekday: "long", year: "numeric", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit"  
        };  
    
        console.log(e.target.elements)

        const [name, address, artist, eventDate, capacity, photoMin, photoBg, subTitle, subDescription] = e.target.elements

        firebase.firestore().collection('event').doc()
        .set({
            name: name.value,
            address: address.value,
            artist: artist.value,
            eventDate: eventDate.value,
            capacity: capacity.value,
            photoMin: photoMin.value,
            photoBg: photoBg.value,
            subTitle: subTitle.value,
            subDescription: subDescription.value,
            id: eventID,
            createdAt: date.toLocaleTimeString("en-us", options),
        }).catch(error => {
            console.log(error)
        }).then((Xfe) => {
            alert(`Event "${name.value}" ajouté correctement`);
        })
    
        }


        
    //     {
    //         name: "Hello Event",
    //         address: "15 rue d'Allemagne, Allemagne",
    //         artist: "James Brown",
    //         date: "14 Janvier 1092",
    //         capacity: "10000",
    //         photo: eventBoxDefaultImg,
    //         background: bandDef1,
    //         subtitle: "Kery James revisite son répertoire dans un concert acoustique",
    //         subdescription: "Cet artiste intarissable allie les mots enragés avec un engagement sincère. Et il n'a pas fini de bousculer la scène urbaine ni de boxer avec toutes les subtilités de la langue française.",
    //         createdAt: "Tuesday, Apr 20, 2021, 4:30 PM",
    //         id: "STG46649543775973190800",
    //     },



        return (
            <div className="new-event-container">
                <form className="new-event-form" onSubmit={handleSubmit}>
                    <h3>Créer un événement</h3>
                    <label htmlFor="name">Nom de l'événement :
                    <input type="text" name="name"/></label>
                    
                    <label htmlFor="address">Emplacement :
                    <input type="text" id="address"/></label>

                    <label htmlFor="artist">Artiste :
                    <input type="text" id="artist"/></label>

                    <label htmlFor="eventDate">Date :
                    <input type="text" id="eventDate"/></label>

                    <label htmlFor="capacity">Capacité :
                    <input type="text" id="capacity"/></label>

                    <label htmlFor="photoMin">Photo miniature :
                    <input type="text" id="photoMin"/></label>

                    <label htmlFor="photoBg">Photo de fond :
                    <input type="text" id="photo"/></label>

                    <label htmlFor="subtitle">Sous-titre :
                    <input type="text" id="subtitle"/></label>

                    <label htmlFor="subdescription">Description :
                    <input type="text" id="subdescription"/></label>

                    <button type="submit">Save</button>
                </form>
            </div>
        )
}

export default NewEvent
