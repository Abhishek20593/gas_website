function signin(event){
    event.preventDefault()
    document.querySelector(".loader-signin").style.display = "block";
    let email = document.getElementById("email").value 
    let password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // console.log(user)
            console.log("Signed in")
            document.querySelector(".loader-signin").style.display = "none";
            location.href = "/gas_website"
            //location.href = "/"
            // document.getElementsByClassName("text")[0].style.display = "block";
        })
        .catch((error) => {
            console.log(error);
        })
}

function signOut(){
    firebase.auth().signOut()
        .then( () => {
            console.log("User logged out")
            location.reload();
        })
        .catch((err) => {
            log(err)
        })
}

var timestamp_arr = Array()
var aq = Array()

function getData(event){
    event.preventDefault();
    // let [date, month, year] = new Date().toLocaleDateString("en-in").split("/")
    // date = "0"+date
    // month = "0"+month
    if(document.getElementById("date").value === ""){
        alert("Please Enter Valid Date!")
        return
    }
    document.querySelector(".loader").style.display = "block";
    document.querySelectorAll("canvas").forEach(canvas=> {
        canvas.style.display="none"
    })

    document.getElementById('data').innerHTML= `
        <tr>
            <th class="td">Timestamp</th>
            <th class="aq">Gas Sensor Output</th>
        </tr>
    `;
    timestamp_arr = Array()
    aq = Array()

    let [year, month, date] = document.getElementById("date").value.split("-")
    console.log(document.getElementById("date").value)


    firebase.database().ref("GAS_SENSOR_APP_V1/"+year+"/"+month+"/"+date+"/").once('value').then( snapshot => {     // use the on() oronce() methods of firebase.database.Reference to observe events.
        document.querySelector(".loader").style.display = "none";
        let data = snapshot.val();
        // console.log(data)
        for(time in data){
           console.log((data[time]));
           insert_data(year+"/"+month+"/"+date+" "+time, data[time]) 
        }
        // for(yr in data){
        //     // console.log(data[yr]);
        //     yrs_data = data[yr]
        //     for(month in yrs_data){
        //         // console.log(yrs_data[month]);
        //         months_data = yrs_data[month]
        //         for(day in months_data){
        //             // console.log(months_data[day])
        //             days_data = months_data[day]
        //             for(time in days_data){
        //                 // console.log((days_data[time]));
        //                 insert_data(yr+"/"+month+"/"+day+" "+time, days_data[time])
        //             }    
        //         }
        //     }
        // }
    })
}

function insert_data(timestamp, data){
    data = data.substring(1, data.length-1).split(",")
    for(i=0;i<data.length; i++){
        data[i] = Number(data[i].substring(1,data[i].length-1))
    }
    timestamp_arr.push(timestamp)
    aq.push(data[3])
    // console.log(data);
    var row = document.getElementById('data')
    row.innerHTML+= `
        <tr>
            <td class="td">${timestamp}</td>
            <td class="aq">${data[3]}</td>
        </tr>`; 
}

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(getPos, error)
//     }else{
//         alert("Geo Location not supported");
//     }
// }

// function getPos(position){
//     document.querySelector(".location").innerHTML = "Latitude: " + position.coords.latitude +
//                                              " Longitude: " + position.coords.longitude 
// }

function error(err) {
    console.log(err.message);
}

function draw_aq_graph(){
    document.querySelectorAll("canvas").forEach(canvas=> {
        canvas.style.display="none"
    })
   document.getElementById('aq').style.display="block"
   new Chart(document.getElementById('aq').getContext('2d'), {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: timestamp_arr,
        datasets: [{
            label: 'Gas Sensor Output',
            backgroundColor: 'rgb(238, 130, 228)',
            borderColor: 'rgb(238, 130, 228)',
            data: aq,
            fill: false
        }]
    },

    // Configuration options go here
    options: {
        //responsive: false,
        //events: ['click'],
        title: {
                display: true,
                text: 'Gas Sensor Output'
        },
        tooltips: {
                mode: 'nearest',
                intersect: true,
       },
        hover: {
                mode: 'nearest',
                intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date and Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Gas Sensor Output'
                }
            }]
        }
    }
});
}
