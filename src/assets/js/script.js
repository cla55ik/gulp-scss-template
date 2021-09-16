import { key } from "../../secret/auth.js";

window.onload = function() {
    let btn = document.getElementById('api');
    let msg = document.getElementById('msg');

    let k = key
    console.log(k);

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let dir = document.location.hostname;
        console.log(dir);
        msg.innerHTML = 'HELLO';
    });


}