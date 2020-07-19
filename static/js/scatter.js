/**
 * @class Scatter
 */
class Scatter {

    // Vars
    minAge = 0
    medAge = 0
    maxAge = 0

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25+17, bottom: 75, left: 75-17};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scDot = d3.scaleLinear()
            .range([2, 10]);
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();


    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Years Experience')
            .style("font-family", "arial")
            .style("font-weight", "bold");
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Homework1 Hours')
            .style("font-family", "arial")
            .style("font-weight", "bold");


        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;
        
        // Map ages.
        const ageMap = vis.data.map(d => d.age);        
        
        // Map years experience.
        const expMap = vis.data.map(d => d.experience_yr);
        
        // Map homework hours.
        const hrsMap = vis.data.map(d => d.hw1_hrs);
        
        // Get min, median, max age.
        vis.minAge = d3.min(ageMap);
        vis.maxAge = d3.max(ageMap);
        vis.medAge = d3.median(ageMap);
        
        // Update scales
        vis.scDot.domain(d3.extent(ageMap));
        vis.scX.domain(d3.extent(expMap));
        vis.scY.domain(d3.extent(hrsMap));           
        vis.xAxis.scale(vis.scX).ticks();
        vis.yAxis.scale(vis.scY).ticks();

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;
                
        // Create div for tooltips.
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")				
          .style("opacity", 0)
          .style("position", "absolute")		
          .style("text-align", "center")			
          .style("width", "60px")			
          .style("height", "42px")					
          .style("padding", "2px")
          .style("font", "12px sans-serif")		
          .style("background", "#D3D3D3")	
          .style("border", "0px")
          .style("pointer-events", "none");
                               
        // Add points.
        vis.g.append('g')
          .selectAll("dot")
          .data(data)
          .enter()
            .append("circle")
            .attr("cx", function (d) { return vis.scX(d.experience_yr); } )
            .attr("cy", function (d) { return vis.scY(d.hw1_hrs); } )
            .attr("r", function(d){ return vis.scDot(d.age) })
            .attr("stroke", "black")
            .style("fill", "#87CEEB")
            .attr("fill-opacity", 0.4)
            .on("mouseover", function(d) {		
              tooltip.transition()		
                .duration(200)		
                .style("opacity", 0.9);		
              tooltip.html("Age: " + d.age + "<br/>" +  "Exp: " + d.experience_yr + "<br/>" + "Hours: " + d.hw1_hrs)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
            .on("mouseout", function(d) {		
              tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
            });
    
        // Render legend circles.
        vis.svg.selectAll("legend")
          .data([vis.minAge,vis.medAge,vis.maxAge])
          .enter()
            .append("circle")
              .attr("cx", vis.svgW - 15)
              .attr("cy", function(d, i){ return vis.svgH/2 - 3.8*i*vis.scDot(vis.maxAge)+16; } )
              .attr("r", function(d){ return vis.scDot(d); })
              .style("fill", "none")
              .attr("stroke", "black");
              
        // Render legend border.
        vis.svg.append("rect")
          .attr("x", vis.svgW - 30 )
          .attr("y", 80)
          .attr("height", 14*vis.scDot(vis.maxAge))
          .attr("width", 3*vis.scDot(vis.maxAge))
          .style("stroke", "black")
          .style("fill", "none")
          .style("stroke-width", "1px");
          
        // Render legend title.
        vis.svg.append("text")
          .text("Age")
          .attr("x", vis.svgW - 28 )             
          .attr("y", 100 )
          .style("font-weight", "bold")  
          .style("font-size", "0.8em")
          .style("font-family", 'arial');
          
        // Render legend circle values.
        vis.svg.selectAll("legend")
          .data([vis.minAge,vis.medAge,vis.maxAge])
          .enter()
            .append("text")
              .text(function(d){ return d; })
              .attr("x", vis.svgW - 22 )             
              .attr("y", function(d, i){ return 218 - 3.7*i*vis.scDot(vis.maxAge); } ) 
              .style("font-size", "0.8em")
              .style("font-family", 'arial');

        // Render chart title.
        vis.g.append("text")
          .text("Student's Class Workload")
          .attr("x", (vis.gW/2))             
          .attr("y", -vis.gMargin.top/2)
          .attr("text-anchor", "middle")
          .style("font-weight", "bold")  
          .style("font-size", "1.5em")
          .style("font-family", 'arial');

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}