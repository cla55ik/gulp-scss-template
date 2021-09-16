document.addEventListener('DOMContentLoaded', () => {
    let urlGetAllPilots = 'https://f1back.ivan5420.ru/api/pilots/';
    fetchGet(urlGetAllPilots);




});


const ajaxRequest = async(method, url, data) => {
    const fetchResp = await fetch(url, {
        method: method,
        // body: data,
        mode: 'no-cors',
        // credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!fetchResp.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return await fetchResp.text();
};

function fetchGet(url) {
    fetch(url, {
            headers: {
                'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',

            },
            // mode: 'no-cors',
        })
        .then((response) => {
            return response.json(); // Преобразуем ответ сервера
        })
        .then((res) => {
            if (res.status == 'ok') {
                console.log(res.data);
                renderPilots(res.data)
            }
        })
        .catch((err) => console.log(err))
}


function renderPilots(objPilots) {
    const pilotList = document.querySelector('.pilot__list');
    objPilots.forEach(element => {
        const pilotCard = document.createElement('div');
        let pilotFioCountry = document.createElement('dev');
        let pilotFio = document.createElement('div');
        let pilotName = document.createElement('div');
        let pilotSurname = document.createElement('div');
        let pilotTeam = document.createElement('div');
        // let pilotTeamLabel = document.createElement('div');
        let pilotCountry = document.createElement('div');
        let pilotCountryImg = document.createElement('img');
        let pilotPhoto = document.createElement('div');
        let pilotPhotoImg = document.createElement('img');

        pilotCard.classList.add('pilot__item');
        pilotFio.classList.add('pilot__fio');
        pilotFioCountry.classList.add('pilot__fio-country');
        pilotName.classList.add('pilot__name');
        pilotSurname.classList.add('pilot__surname');
        pilotTeam.classList.add('pilot__team');
        // pilotTeamLabel.classList.add('pilot__team-label');
        pilotCountry.classList.add('pilot__country');
        pilotPhoto.classList.add('pilot__photo');

        let pilot = element;
        pilotName.innerHTML = pilot.name;
        pilotSurname.innerHTML = pilot.surname;
        pilotTeam.innerHTML = pilot.team;
        // pilotCountry.innerHTML = pilot.country;
        pilotCountryImg.setAttribute('src', `/assets/img/pilots/${pilot.country}.jpg`);
        pilotPhotoImg.setAttribute('src', `/assets/img/pilots/${pilot.surname}.png`);

        let backGround = 'noname';
        if (pilot.team == 'Red Bull') {
            backGround = 'redbull';
        }

        if (pilot.team == 'Mercedes AMG F1') {
            backGround = 'mercedes';
        }

        if (pilot.team == 'Scuderia Ferrari') {
            backGround = 'ferrari';
        }
        pilotPhoto.style.backgroundImage = `url(assets/img/cars/${backGround}.png)`;

        pilotList.append(pilotCard);
        pilotCard.appendChild(pilotFioCountry);
        pilotFioCountry.appendChild(pilotFio);
        pilotFio.appendChild(pilotName);
        pilotFio.appendChild(pilotSurname);
        pilotFioCountry.appendChild(pilotCountry);
        pilotCountry.appendChild(pilotCountryImg);
        pilotCard.appendChild(pilotTeam);
        pilotCard.appendChild(pilotPhoto);
        pilotPhoto.appendChild(pilotPhotoImg);
        // pilotTeam.appendChild(pilotTeamLabel)

    });

    // pilotCard.innerHTML = 'Pilot';

}