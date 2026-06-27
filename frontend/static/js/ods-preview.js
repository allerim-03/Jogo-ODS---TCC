const cards = document.querySelectorAll(".ods-card");

cards.forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = (x - rect.width/2)/18;
        const rotateX = -(y - rect.height/2)/18;

        card.style.transform =
        `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-12px)
        scale(1.03)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="";

    });

});