document.addEventListener('DOMContentLoaded', function(){

    const paper = document.querySelector("#paper"),
    pen = paper.getContext("2d");

    let soundEnabled = false;

    document.onvisibilitychange = () => soundEnabled = false;
    paper.onclick = () => soundEnabled = !soundEnabled

    let startTime = new Date().getTime();

    const calculateVelocity = index => {  
    const numberOfCycles = 100 - index,
            distancePerCycle = 2 * Math.PI;

    return (numberOfCycles * distancePerCycle) / 900;
    }

    const calculateNextImpactTime = (currentImpactTime, velocity) => {
    return currentImpactTime + (Math.PI / velocity) * 1000;
    }

    const arcs = [
    "#ffffff",
    "#f7eefc", 
    "#eedef9", 
    "#e6cdf6", 
    "#ddbdf4", 
    "#d5acf1", 
    "#cd9cee",
    "#c48beb",
    "#bc7ae8",
    "#b46ae5",
    "#ab59e2",
    "#a349e0",
    "#9a38dd",
    "#9228da",
    "#8723cb",
    "#7c20ba",
    "#711daa",
    "#661a99",
    "#5b1889",
    "#501578",
    "#451268"
    ].map((color, index) => {
    const audio = new Audio(`keys/key-${index}.wav`)

    velocity = calculateVelocity(index);

    audio.volume = 0.1;

    return{
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
    })
    ;

    const draw = () => {

    const currentTime = new Date().getTime(),
            elapsedTime = (currentTime - startTime) / 1000;

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
        x: paper.width * 0.1,
        y: paper.height * 0.9
    }

    const end = {
        x: paper.width * 0.9,
        y: paper.height * 0.9
    }

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.9
    }

    const lenght = end.x - start.x,
            initialArcRadius = lenght * 0.05;

    const spacing = (lenght / 2 - initialArcRadius) / arcs.length;


    pen.strokeStyle = "white";
    pen.lineWidth = 3;

    //Draw line
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    arcs.forEach((arc, index) =>{
        const velocity = calculateVelocity(index),
                maxAngle = 2 * Math.PI,
                distance = Math.PI + (elapsedTime * velocity),
                modDistance = distance % maxAngle,
                adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance,
                arcRadius = initialArcRadius + (index * spacing);
            
        const x = center.x + arcRadius * Math.cos(adjustedDistance),
                y = center.y + arcRadius * Math.sin(adjustedDistance);

        //Draw arc
        pen.beginPath();
        pen.strokeStyle = arc.color;
        pen.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI);
        pen.stroke();
        
        //Draw circle
        pen.fillStyle = "white"
        pen.beginPath();
        pen.arc(x, y, lenght * 0.0065, 0, 2 * Math.PI);
        pen.fill();

        if(currentTime >= arc.nextImpactTime){
            if(soundEnabled){
                arc.audio.play();
            }

            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
        }

    })

    requestAnimationFrame(draw);
    }

    draw();
})