async function fetch_data_funkcija(){
    fetch("http://localhost:3000/oseba").then(data => {
        return data.json();
    }).then( objectData => {
        let tableData = "";
        objectData.forEach(element => {
            console.log(element);
        });
    });
}
async function fetch_project(id_project){
    let obj;
    const res = await fetch(`http://localhost:3000/projekt/${id_project}`)
    obj = await res.json();
    return obj.naslov;
}
//tukaj dobimo podatke in jih prikazemo tako, da dodamo za vsake podatke svojo vrstico in gumb
async function fetch_data_funkcija_tabela(){
    await fetch("http://localhost:3000/oseba", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        }).then(data => {
        return data.json();
    }).then( objectData => {
        let tableData = "";
        objectData.map((values) => {
            let placa_tmp = new Intl.NumberFormat('de-DE').format(values.placa);
            tableData += `<tr>
            <td class="pencil">
            <img src="pencil_icon.png" alt="pencil_icon" id="pencil_icon" onclick="klik()"/>
            </td>
            <td class="val">${values.id}</td>
            <td class="name">${values.ime_priimek}</td>
            <td class="name">${values.email}</td>
            <td class="title">${values.naziv}</td>
            <td class="pay">${placa_tmp}</td>
            <td class="cnum">${values.telefon}</td>
            <td class="name">${values.lokacija_id}</td>
            <td class="name">${values.projektId}</td>
          </tr>`;
        });
        document.getElementById("table_body").innerHTML = tableData;
    });
    let additionalRow = "";
    additionalRow +=`<tr>
    <th colspan="9"  style="text-align:right; font-weight:100; font-size:11pt;">1 - ${document.getElementById("table_body").rows.length}</th>
    </tr>`;
    document.getElementById("table_body").innerHTML += additionalRow;
    console.log(document.getElementById("table_body").rows.length)
    //najprej aysnc in dat away, da se naredi fetch do konca in se promise konca
    const proj = await fetch(`http://localhost:3000/projekt/`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    let projects = await proj.json()
    var table = document.getElementById("table_body");
    for (var i = 0, row; row = table.rows[i]; i++) {
        var col = row.cells[8];//projektId
        for (var j = 0;  j < projects.length; j++) {
            //zadnja vrstica se izpusti
            if(i < table.rows.length-1){
                if(col.innerHTML == projects[j].id){ 
                    col.innerHTML = projects[j].naslov;
                    break;
                }
            }
        }
    }

}
function return_location(locationId){
    var ln = "";
    ln = document.getElementById("location_form");
    return ln;
}
async function fetch_projects(){
    await fetch("http://localhost:3000/projekt").then(data => {
        return data.json();
    }).then( objectData => {
        let tableData = "";
        objectData.map((values) => {
            tableData += `<tr>
            <td class="pencil1">
            <img src="pencil_icon.png" alt="pencil_icon" id="pencil_icon" onclick="klik_p()"/>
            </td>
            <td class="val">${values.id}</td>
            <td class="name">${values.naslov}</td>
            <td class="date">${reformat_date_to_EU(values.zacetek)}</td>
            <td class="date">${reformat_date_to_EU(values.konec)}</td>
            <td class="state">${values.stanjeId}</td>
          </tr>`;
        });
        document.getElementById("table_body_p").innerHTML = tableData;
    });
    let additionalRow = "";
    additionalRow +=`<tr>
    <th colspan="6"  style="text-align:right; font-weight:100; font-size:11pt;">1 - ${document.getElementById("table_body_p").rows.length}</th>
    </tr>`;
    document.getElementById("table_body_p").innerHTML += additionalRow;
    console.log(localStorage);
}
function reformat_date_to_EU(date){
    var ndf="";
    if(date){
    var odf = date.split("-");
    ndf = odf[2]+"/"+odf[1]+"/"+odf[0];//iz formata YYYY-MM-DD dobimo DD/MM/YYYY
    }
    return ndf;
}
function reformat_date_to_US(date){
    var ndf = "";
    if(date){
    var odf = date.split("/");
    ndf = odf[2]+"-"+odf[1]+"-"+odf[0];//iz formata DD/MM/YYYY dobimo YYYY-MM-DD
    }
    return ndf;
}
//////////////////////////////////////////////////////////////////////////////////
//REDIRECTS///////////////////////////////////////////////////////////////////////
function redirect_forma(){
    localStorage.clear();
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/forma.html";
}
function create_user_redirect(){
    localStorage.clear();
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/forma.html";
}
function create_project_redirect(){
    localStorage.clear();
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/forma_p.html";
}
function open_home(){
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/home_page.html";
}
function open_users(){
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/spletna_stran.html";
}
function open_projects(){
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/projekti.html";
}
function redirect_prva_stran(){
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/spletna_stran.html";
    localStorage.clear();
}
function redirect_projekti(){
    window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/projekti.html";
    localStorage.clear();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//tukaj pogledamo podatke v doloceni vrstici s klikom na gumb v doloceni vrstici
var data_arr = [];
function klik(){
    var tab = document.getElementById("tabela_podatkov");
    var rows = tab.getElementsByTagName("tr");
    for (i = 2; i < rows.length-1; i++) { //-1 da spustimo zadnjo prazno vrstico
        var curr_row = tab.rows[i];
        var handler = function (row){
            return function (){
                data_arr = [];
                //tukaj gremo cez podatke v tabeli po stolpcih 0-pencil slika, 1-id, 2-name, 3-username ...
                for(i = 1;i <= 8; i++){
                    var cell = row.getElementsByTagName("td")[i];
                    var ida = cell.innerHTML;
                    data_arr.push(ida);
                }
                
                localStorage.setItem("temp_data", data_arr);
                
                window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/forma.html";
            };
        };
        curr_row.getElementsByTagName("td")[0].onclick = handler(curr_row);
    }
}
var data_arr_p = [];
function klik_p(){
    var tab = document.getElementById("tabela_projektov");
    var rows = tab.getElementsByTagName("tr");
    //prva vrstica ima gumb druga je pa glava tabele
    for (i = 2; i < rows.length-1; i++) { //-1 da ne stejemo zadnje vrstice, ki je prazna
        var curr_row = tab.rows[i];
        console.log(curr_row);
        var handler = function (row){
            return function (){
                data_arr_p = [];
                //tukaj gremo cez podatke v tabeli po stolpcih 0-pencil slika, 1-id, 2-project_name ...
                for(i = 1;i <= 5; i++){
                    var cell = row.getElementsByTagName("td")[i];
                    var ida = cell.innerHTML;
                    data_arr_p.push(ida);
                }
                
                localStorage.setItem("temp_data", data_arr_p);
                
                window.location.href = "file:///C:/Users/Uporabnik/Desktop/DN_html/forma_p.html";
            };
        };
        curr_row.getElementsByTagName("td")[0].onclick = handler(curr_row);//to je slika svinčnika
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function druga_stran(){
    console.log(localStorage);
}
//ce sem na strani forme ZA OSEBO in smo prisli iz klika na view v tabeli potem se podatki napisejo v formo
if (window.location.href.match("file:///C:/Users/Uporabnik/Desktop/DN_html/forma.html") && localStorage.length != 0){
    window.onload = function form_filled(){ 

        var temp_val = localStorage.getItem("temp_data");
        var data_values = temp_val.split(",");
        console.log(data_values);

        document.getElementById("id_form").value = data_values[0];
        document.getElementById("name_form").value = data_values[1];
        document.getElementById("email_form").value = data_values[2];
        document.getElementById("job_form").value = data_values[3];
        document.getElementById("salary_form").value = data_values[4].replace(".","");
        document.getElementById("phone_form").value = data_values[5];
        document.getElementById("location_form").value = data_values[6];
        document.getElementById("project_form").value = data_values[7];

        const button1 = document.getElementById("button_U");
        button1.disabled = false;
        button1.hidden = false;

        const button2 = document.getElementById("button_D");
        button2.disabled = false;
        button2.hidden = false;
    }
}
//ce smo na formi ZA OSEBOs in je local storage == 0 kar pomeni, da smo sem prisli s klikom na gumb CREATE USER
if (window.location.href.match("file:///C:/Users/Uporabnik/Desktop/DN_html/forma.html") && localStorage.length == 0){
    
    window.onload = function form_empty(){

        const button1 = document.getElementById("button_C");
        button1.disabled = false;
        button1.hidden = false;

        const input1 = document.getElementById("id_form");
        input1.readOnly = false;
        
    }

}
//ce sem na strani forme ZA PROJEKT in smo prisli iz klika na view v tabeli potem se podatki napisejo v formo
if (window.location.href.match("file:///C:/Users/Uporabnik/Desktop/DN_html/forma_p.html") && localStorage.length != 0){
    window.onload = function project_form_filled(){ 

        var temp_val = localStorage.getItem("temp_data");
        var data_values = temp_val.split(",");
        console.log(data_values);

        document.getElementById("id_form_p").value = data_values[0];
        document.getElementById("title_form").value = data_values[1];
        document.getElementById("start_form").value = reformat_date_to_US(data_values[2]);
        document.getElementById("end_form").value = reformat_date_to_US(data_values[3]);
        document.getElementById("status_form").value = data_values[4];

        const button1 = document.getElementById("button_U_p");
        button1.disabled = false;
        button1.hidden = false;

        const button2 = document.getElementById("button_D_p");
        button2.disabled = false;
        button2.hidden = false;
    }
}
//ce smo na formi ZA PROJEKT in je local storage == 0 kar pomeni, da smo sem prisli s klikom na gumb CREATE USER
if (window.location.href.match("file:///C:/Users/Uporabnik/Desktop/DN_html/forma_p.html") && localStorage.length == 0){
    
    window.onload = function project_form_empty(){

        const button1 = document.getElementById("button_C_p");
        button1.disabled = false;
        button1.hidden = false;

        const input1 = document.getElementById("id_form_p");
        input1.readOnly = false;
        
    }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//USERS
function create_user(){ 
    const tmp = document.getElementById("forma_vnos"); 
    if(!tmp.checkValidity()){
        var form = document.getElementById("forma_vnos");
        console.log("Vnesi naslov");
        var tmpSubmit = document.createElement('button')
        form.appendChild(tmpSubmit)
        tmpSubmit.click()
        form.removeChild(tmpSubmit)
    }
    else{
    console.log("USER CREATED");
    fetch('http://localhost:3000/oseba', {
    method: 'POST',
    body: JSON.stringify({ 
        id: parseInt(document.getElementById("id_form").value),
        ime_priimek: document.getElementById("name_form").value,
        email: document.getElementById("email_form").value,
        naziv: document.getElementById("job_form").value,
        placa: parseInt(document.getElementById("salary_form").value),
        telefon: document.getElementById("phone_form").value,
        lokacija_id: parseInt(document.getElementById("location_form").value),
        projektId: parseInt(document.getElementById("project_form").value),
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
   })
  .then((response) => response.json())
  .then((json) => console.log(json));
  redirect_prva_stran();
    }
}
function update_user(){
    const tmp = document.getElementById("forma_vnos"); 
    if(!tmp.checkValidity()){
        var form = document.getElementById("forma_vnos");
        console.log("Vnesi naslov");
        var tmpSubmit = document.createElement('button')
        form.appendChild(tmpSubmit)
        tmpSubmit.click()
        form.removeChild(tmpSubmit)
    }
    else{
    console.log("USER UPDATED");
    fetch(`http://localhost:3000/oseba/${document.getElementById("id_form").value}`, {
    method: 'PUT',
    body: JSON.stringify({ 
        id: parseInt(document.getElementById("id_form").value),
        ime_priimek: document.getElementById("name_form").value,
        email: document.getElementById("email_form").value,
        naziv: document.getElementById("job_form").value,
        placa: parseInt(document.getElementById("salary_form").value),
        telefon: document.getElementById("phone_form").value,
        lokacija_id: parseInt(document.getElementById("location_form").value),
        projektId: parseInt(document.getElementById("project_form").value),
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
   })
  .then((response) => response.json())
  .then((json) => console.log(json));
  redirect_prva_stran();
    }
}
function delete_user(){
    console.log("USER DELETED");
    fetch(`http://localhost:3000/oseba/${document.getElementById("id_form").value}`,{
        method: "DELETE",
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    redirect_prva_stran();
}
//PROJECTS
function create_project(){
    const tmp = document.getElementById("forma_vnos_p"); 
    if(!tmp.checkValidity()){
        var form = document.getElementById("forma_vnos_p");
        console.log("Vnesi naslov");
        var tmpSubmit = document.createElement('button')
        form.appendChild(tmpSubmit)
        tmpSubmit.click()
        form.removeChild(tmpSubmit)
    }
    else{
    console.log("PROJECT CREATED");
    fetch('http://localhost:3000/projekt', {
    method: 'POST',
    body: JSON.stringify({ 
        id: parseInt(document.getElementById("id_form_p").value),
        naslov: document.getElementById("title_form").value,
        zacetek: document.getElementById("start_form").value,
        konec: document.getElementById("end_form").value,
        stanjeId: document.getElementById("status_form").value,
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
   })
  .then((response) => response.json())
  .then((json) => console.log(json));
  redirect_projekti();
    }

}
function update_project(){
    const tmp = document.getElementById("forma_vnos_p"); 
    if(!tmp.checkValidity()){
        var form = document.getElementById("forma_vnos_p");
        console.log("Vnesi naslov");
        var tmpSubmit = document.createElement('button')
        form.appendChild(tmpSubmit)
        tmpSubmit.click()
        form.removeChild(tmpSubmit)
    }
    else{
    console.log("PROJECT UPDATED");
    fetch(`http://localhost:3000/projekt/${document.getElementById("id_form_p").value}`, {
    method: 'PUT',
    body: JSON.stringify({ 
        id: parseInt(document.getElementById("id_form_p").value),
        naslov: document.getElementById("title_form").value,
        zacetek: document.getElementById("start_form").value,
        konec: document.getElementById("end_form").value,
        stanjeId: document.getElementById("status_form").value,
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
   })
  .then((response) => response.json())
  .then((json) => console.log(json));
  redirect_projekti();
    }
}
function delete_project(){
    console.log("PROJECT DELETED");
    fetch(`http://localhost:3000/projekt/${document.getElementById("id_form_p").value}`,{
        method: "DELETE",
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    redirect_projekti();
}
//SIDE BAR NAVIGATIN FUNCTIONS
var closedNav = true; 
var el = document.getElementsByClassName("openNav1");
function openNav() {
    if(closedNav){
        document.getElementById("customSideNavigation").style.width = "150px";
        document.getElementById("mainBody").style.marginLeft = "165px";
        closedNav = false;
        for (var i = 0; i < el.length; i++) {
            el[i].innerHTML = "&#9932;";
        }
    }
    else{
        document.getElementById("customSideNavigation").style.width = "0";
        document.getElementById("mainBody").style.marginLeft= "15px";
        closedNav = true;
        for (var i = 0; i < el.length; i++) {
            el[i].innerHTML = "&#9776;";
        }
    }
}
