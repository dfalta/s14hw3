/**
 * @class Donut
 */
class Donut {

    // Vars
    counts = {};
    data_arcs = [];

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    innerRadius = 0.2*this.gW;
    outterRadius = 0.5*this.gW;

    // Tools
    color = d3.scaleOrdinal(['#4E84C4','#D16103','#52854C','#A51C30','#8996A0','#C4961A']);
    arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outterRadius);
    pie = d3.pie();


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
            .style('transform', `translate(${vis.outterRadius+ vis.gMargin.left}px, ${vis.outterRadius + vis.gMargin.top}px)`);

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

        // Map programing languages data.
        const langMap = vis.data.map(d => d.prog_lang);
        
        // Fill dictionary of language counts.
        var counts = {}
        for (var i = 0; i < langMap.length; i++) {
          var lang = langMap[i]
          if (!counts[lang]) {
            counts[lang] = 0;
          }
          counts[lang]++;
        } 
        vis.counts = d3.entries(counts)
        
        // Calculate donut chart arcs.
        vis.data_arcs = vis.pie.value( function(d) { return d.value; })(vis.counts);

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

        // Render donut chart
        vis.g.selectAll(".arc")
          .data(vis.data_arcs)
          .enter()
          .append("g")
            .attr("class", "arc")
          .append("path")
            .attr("d", this.arc)
            .attr("fill", function(d, i) {
              return vis.color(i);
            })
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .on("mouseover", function(d) {
              d3.select(this).attr("opacity", 0.7);
              d3.select(".lang-"+d.data.key)
                .style("opacity", 1);
            })
            .on("mouseout", function(d) {
              d3.select(this).attr("opacity", 1);
              d3.select(".lang-"+d.data.key)
                .style("opacity", 0);
            });
          
        // Render text labels.  
        vis.g.selectAll(".arc")
          .data(vis.data_arcs)
          .append("text")
            .text(function(d){ return d.data.key;})
            .attr("transform", function(d) { return "translate(" + vis.arc.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-weight", "bold")
            .style("font-size", "1.2em")
            .style("font-family", 'monospace');
            
        // Render info text in center of donut.  
        vis.g.selectAll(".arc")
          .data(vis.data_arcs)
          .append("text")
            .text(function(d){ return d.data.value; })
            .attr("class", function(d){ return "lang-"+d.data.key;})
            .style("text-anchor", "middle")
            .style("opacity", 0);
            
        // Render chart title.
        vis.g.append("text")
          .text("User Programing Languages")
          .attr("x", 0)             
          .attr("y", -vis.outterRadius-vis.gMargin.top/2)
          .attr("text-anchor", "middle")
          .style("font-weight", "bold")  
          .style("font-size", "1.5em")
          .style("font-family", 'monospace');
  

    }
}