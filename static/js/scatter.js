/**
 * @class Scatter
 */
class Scatter {

    // Vars
    data_bins = [];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
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
            .text('Years Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('HW1 Hours');


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
        
        // Update scales
        vis.scDot.domain(d3.extent(ageMap));
        vis.scX.domain(d3.extent(expMap));
        vis.scY.domain(d3.extent(hrsMap));           
        vis.xAxis.scale(vis.scX).ticks(vis.data_bins.length);
        vis.yAxis.scale(vis.scY);

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
            .attr("fill-opacity", .4);
            
        // Render chart title.
        vis.g.append("text")
          .text("Student's Class Workload")
          .attr("x", (vis.gW/2))             
          .attr("y", -vis.gMargin.top/2)
          .attr("text-anchor", "middle")
          .style("font-weight", "bold")  
          .style("font-size", "1.5em");

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}