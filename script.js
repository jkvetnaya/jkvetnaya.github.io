
function option_number(option) {
    var option_num;
    if(option == "All") {
        option_num = "All";     
    } else if(option == "Zero") {
        option_num = 0;
    } else if(option == "Two") {
        option_num = 2;
    } else if(option == "Three") {
        option_num = 3;
    } else if(option == "Four") {
        option_num = 4;
    } else if(option == "Six") {
        option_num = 6;
    } else if(option == "Eight") {
        option_num = 8;
    } else if(option == "Twelve") {
        option_num = 12
    }
    return option_num;
}


function render(data, option_num) {
    d3.selectAll("svg > *").remove();
    var total_width = d3.select("svg").attr("width");
    var total_height = d3.select("svg").attr("height");
    var margin=50;    
    width = total_width-2*margin;
    height = total_height-2*margin;

    var tooltip = d3.select("#tooltip");
  
    var annotation = d3.select("#annotation");
    var annotation1 = d3.select("#annotation1");
    var annotation2 = d3.select("#annotation2");
    var annotation3 = d3.select("#annotation3");
    

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
                if(option_num == "All" || d["EngineCylinders"] == option_num) {
                    return xs(d["AverageCityMPG"]);
                }
            })
            .attr("cy", function(d, i) {
                if(option_num == "All" || d["EngineCylinders"] == option_num) {
                    return ys(d["AverageHighwayMPG"]);
                }
            })
            .attr("r", function(d, i) {    
                if(option_num == "All" || d["EngineCylinders"] == option_num) {
                    return parseInt(d["EngineCylinders"])+2;
                }
            })
            .on("mouseover", function(d, i){
                if(option_num == "All" || d["EngineCylinders"] == option_num) {
                    tooltip.style("opacity", 1)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px")
                            .html("Make: " + d["Make"] + "\n" +
                            " Fuel: " + d["Fuel"] + "\n" +
                            " Cylinders: " + d["EngineCylinders"]);

                    var timer = d3.timer(function(duration) {
                            if (duration > 2500){
                                tooltip.style("opacity", 0)
                                timer.stop();
                            }
                    }, 2000);
                }
            })
    ;;
    annotation.style("opacity", 1)
        .style("left", "70px")
        .style("top", "650px")
        .html("Engine efficiency depends primarily on the number of cylinders.");
    
    annotation1.style("opacity", 1)
        .style("left", "380px")
        .style("top", "280px")
        .html("Zero cylinders (electrical)");
    
    annotation2.style("opacity", 1)
        .style("left", "140px")
        .style("top", "450px")
        .html("Two to four\ncylinders");
    
    annotation3.style("opacity", 1)
        .style("left", "75px")
        .style("top", "500px")
        .html("Six to\ntwelve\ncylinders");
    
    var yAxis = d3.axisLeft(ys)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"))
            ;
    
    var xAxis = d3.axisBottom(xs)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"))
            ;
    
 
    
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(yAxis);
    
    d3.select("svg")
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x",  0 - (height / 2)-60)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "15px")
            .text("Highway Miles per Gallon (logarithmic scale)");
            

    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+(height+margin)+")")
        .call(xAxis);
    
    d3.select("svg")
        .append("text")      // text label for the x axis
        .attr("x", width / 2 + 30 )
        .attr("y",  height + margin + 40)
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("City Miles per Gallon (logarithmic scale)");
}

async function init() {
    
    const data = await d3.csv(
        'https://flunky.github.io/cars2017.csv');
    

    
    var options_data = ["All", "Zero", "Two", "Three", "Four", "Six", "Eight", "Twelve"];

    var select = d3.select("#dropdown")
      .append('select')
        .attr('class','select')
        .on('change',onchange)

    var options = select
      .selectAll('option')
        .data(options_data).enter()
        .append('option')
            .text(function (d) { return d; });

    function onchange() {
        selectValue = d3.select('select').property('value')
        var option_num = option_number(selectValue);
        document.cookie = selectValue;
        render(data, option_num);
    };
    
    var option = document.cookie;
    if(option == "") {
        option = "All";
    }
    var option_num = option_number(option);
    d3.select('select').property('value', option);
    render(data, option_num);
}

