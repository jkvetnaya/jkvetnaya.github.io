
async function init() {
    
    const data = await d3.csv(
        'https://flunky.github.io/cars2017.csv');
    
    var i;
    

    
    var total_width = d3.select("svg").attr("width");
    var total_height = d3.select("svg").attr("height");
    var margin=50;    
    width = total_width-2*margin;
    height = total_height-2*margin;
    
    var tooltip = d3.select("#tooltip");


    var xdomain = [10, 150];
    var xrange = [0, width];
    var ydomain = [10, 150];
    var yrange = [height, 0];
 
    var xs = d3.scaleLog().domain(xdomain)
                        .range(xrange);
                      

    var ys = d3.scaleLog().domain(ydomain)
                            .range(yrange);
                    

    d3.select("svg")
        .append("g")
            .attr("transform",
                 "translate("+margin+","+margin+")")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
           .attr("cx", function(d, i) { 
                return xs(d["AverageCityMPG"]);
            })
            .attr("cy", function(d, i) {
                return ys(d["AverageHighwayMPG"]);
            })
            .attr("r", function(d, i) {    
                return parseInt(d["EngineCylinders"])+2;
            })
            .on("mouseover", function(d, i){
                console.log("Mouseover: i=" + i+ " x=" + d3.event.pageX + " y=" + d3.event.pageY);
                tooltip.style("opacity", 1)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
                        .html("Make: " + d["Make"] + 
                        " Fuel: " + d["Fuel"] + 
                        " Cylinders: " + d["EngineCylinders"] +
                        " City MPG: " + d["AverageCityMPG"] +
                        " Highway MPG: " + d["AverageHighwayMPG"]);
            })
            //.on("mouseout", function() { tooltip.style("opacity", 0);})
    ;;
    

    var yAxis = d3.axisLeft(ys)
                .tickValues([10, 20, 50, 100])
                .tickFormat(d3.format("~s"))
                //.text("Average Highway MPG")
                ;
    
    var xAxis = d3.axisBottom(xs)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"))
            //.text("Average City MPG")
            ;
    
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(yAxis);
            

    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+(height+margin)+")")
        .call(xAxis);
 

}
