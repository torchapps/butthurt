require("./styles/scss/style.scss");
var React = require("react");

var bh = {
  arrowKeys: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }
}

var App = React.createClass({
  getInitialState: function(){
    return {butthurts: [], selectedNode: null, previousNode: null, nextNode: null}
  },
  componentDidMount: function(){
    reqwest("data.csv", function(data){
      var raw = Papa.parse(data);
      var labels = raw.data.shift();

      var results = _.chain(raw.data)
        // remove blank entries. stopgap.
        .filter(function(d){
          return d.length >= 3;
        })
        // convert to proper form.
        .map(function (r){
          var o = {};
          for (var i in r) o[labels[i]] = r[i];
          o.date = moment(o.date);
          return o;
        })
        .reverse()
        // calculate intervals for positioning
        .forEach(function(r, index, list){
          if (list[index + 1]) {
            r.interval = r.date.diff(list[index + 1].date, 'days');
          } else {
            r.interval = 0;
          }
        })
        .value();
      this.setState({butthurts: results});
    }.bind(this));

    // window.onscroll = this.scrollHandler;
    window.onkeydown = this.keyHandler;
  },
  findButthurtNodeFromScroll: function(){
    var y = $("body,html").scrollTop() || $("body").scrollTop(); // because fuck firefox;
    var butthurtNodes = document.querySelectorAll('.selectable');

    var foundIndex = Math.max(
      _.findIndex(butthurtNodes, function(node, index, list){
        var nextNode = list[index + 1];
        var upperBound = node.offsetTop;
        var lowerBound = nextNode ? nextNode.offsetTop : node.offsetHeight;
        // console.log(upperBound, lowerBound);
        return y >= upperBound && y < lowerBound;
      }), 0);
    this.setState({selectedNode: butthurtNodes[foundIndex]});
    this.setState({nextNode: butthurtNodes[foundIndex + 1]});

    if (butthurtNodes[foundIndex].offsetTop >= y) {
      // scroll position is close enough to the node to consider the node to be at the top of the screen.
      this.setState({previousNode: butthurtNodes[foundIndex - 1]});
    } else {
      // scroll position is so that the node is way above the screen to consider that node to be the previous node
      this.setState({previousNode: this.state.selectedNode});
    }
  },
  keyHandler: function(e){
    var keysPressed = function(keys){ return _.contains(keys, e.keyCode); }

    if(keysPressed([32, 37, 38, 39, 40])) { e.preventDefault(); }

    var nextKeys = [bh.arrowKeys.RIGHT, bh.arrowKeys.DOWN];
    var prevKeys = [bh.arrowKeys.LEFT, bh.arrowKeys.UP];

    if (keysPressed(nextKeys)) {
      this.goNext();
    } else if (keysPressed(prevKeys)) {
      this.goPrev();
    }
  },
  goNext: function(){
    this.findButthurtNodeFromScroll();
    // settimeout needed to make buttons work. no fucking idea why.
    setTimeout(function(){
      if (this.state.nextNode){
        this.animateToButthurt(this.state.nextNode);
      }
    }.bind(this), 0);
  },
  goPrev: function(){
    this.findButthurtNodeFromScroll();
    // settimeout needed to make buttons work. no fucking idea why.
    setTimeout(function(){
      if (this.state.previousNode) {
        this.animateToButthurt(this.state.previousNode);
      }
    }.bind(this), 0);
  },
  animateScroll: function(loc){
    $("body,html").animate({ scrollTop: loc + "px" });
  },
  animateToButthurt: function(butthurt){
    this.animateScroll(butthurt.offsetTop);
  },
  latestDate: function(butthurts){
    var date = _.chain(butthurts).sortBy("date").last().value();
    return date ? date.date : null;
  }, 
  render: function(){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daysSince = moment().diff(this.latestDate(this.state.butthurts), 'days');
    var getStyle = function(interval) {
      return {
        'minHeight': interval * 20 + "px"
      }
    }.bind(this);
    var butthurtList = this.state.butthurts.map(function(butthurt, index){
      return (
        <div key={index} className="butthurt-container selectable horizontal layout" style={getStyle(butthurt.interval)}>
          <div className="side">
            <div className="month">
              {butthurt.date.format("MMM")}
            </div>
            <div className="day">
              {butthurt.date.format("DD")}
            </div>
            <div className="year">
              {butthurt.date.format("YYYY")}
            </div>
          </div>
          <div className="main flex">
            <p>
              {butthurt.desc}
            </p>
            <a className="inline" href={butthurt.src}>Source</a>
          </div>
        </div>
      )
    });
    return (
      <div>
        <div id="donate">
          <form target="_blank" id="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" className="ng-pristine ng-valid">
            <input type="hidden" name="cmd" value="_s-xclick"/>
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
              "/>
            <button type="submit" className="clearfix">
              <div>
                <small>Support us</small>
              </div>
              <div>
                &#x2605; Donate! &#x2605;
              </div>
            </button>
            <img className="go-away" alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
          </form>
        </div>
        <div id="background" className="horizontal layout">
          <div className="sidebar"></div>
          <div className="flex"></div>
        </div>
        <div className="layout vertical center butthurt-list">
          <div className="butthurt-container selectable horizontal layout">
            <div className="side">
              <h3 id="now">Now</h3>
            </div>
            <div className="main flex">
              <h1>{daysSince} Days since last butthurt</h1>
              <p>
                Butthurt is a tribute to Filipino (over)sensitivities, and nothing more.
              </p>
              <p>
                If you'd like to suggest a new entry, click <a className="inline" href="https://docs.google.com/forms/d/1Cexh4k5-nfwX9RKmv7Dwd4DcGweXLh8Kn6iZXbob0hU/viewform">here</a> or drop us a <a className="inline" href="https://github.com/torchapps/butthurt">pull request</a>!
              </p>
              <p>
                Made by <a className="inline" href="https://torchapps.github.io/">Torch</a>
              </p>
            </div>
          </div>
          {butthurtList}
        </div>
        <div id="controls" className="vertical layout center">
          <div className="control-container horizontal layout">
            <button type="button" className="flex control" onClick={this.goPrev}>Prev</button>
            <button type="button" className="flex control" onClick={this.goNext}>Next</button>
          </div>
        </div>
      </div>
    )
  }
})

React.render(
  <App />,
  document.getElementById('app')
);