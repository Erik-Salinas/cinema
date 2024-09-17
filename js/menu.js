let nav =  document.querySelector("#nav");
let open = document.querySelector("#open");
let close = document.querySelector("#close");
let navLinks = document.querySelectorAll("#nav__link");


open.addEventListener("click", ()=>{
nav.classList.add("nav-visible");
 
})

close.addEventListener("click", ()=>{
nav.classList.remove("nav-visible")

})

navLinks.forEach(link => {
link.addEventListener("click", () => {
    nav.classList.remove("nav-visible");
  
});
});
