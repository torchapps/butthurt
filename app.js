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
    return {butthurts: [], selectedIndex: 0}
  },
  componentDidMount: function(){
    reqwest("data.csv", function(data){
      var raw = Papa.parse(data);
      var labels = raw.data.shift();

      var results = _.chain(raw.data)
        // remove blank entries. stopgap.
        .filter(function(d){
          return d.length >= 4;
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

    window.onscroll = this.scrollHandler;
    window.onkeydown = this.keyHandler;
  },
  findButthurtIndexFromScroll: function(){
    var y = document.body.scrollTop;
    var butthurtNodes = document.querySelectorAll('.selectable');

    var foundIndex = _.findIndex(butthurtNodes, function(node, index, list){
      var nextNode = list[index + 1]
      var upperBound = node.offsetTop;
      var lowerBound = nextNode ? nextNode.offsetTop : node.offsetHeight;
      return y >= upperBound && y < lowerBound;
    });

    return Math.max(foundIndex, 0);
  },
  scrollHandler: _.throttle(function(){
    this.setState({selectedIndex: this.findButthurtIndexFromScroll()});
    console.log(this.state.selectedIndex);
  }, 200, {leading: false}),
  keyHandler: function(e){
    var keysPressed = function(keys){
      return _.contains(keys, e.keyCode);
    }
    if(keysPressed([32, 37, 38, 39, 40])) {
      e.preventDefault();
    }

    var nextKeys = [bh.arrowKeys.RIGHT, bh.arrowKeys.DOWN];
    var prevKeys = [bh.arrowKeys.LEFT, bh.arrowKeys.UP];

    if (keysPressed(nextKeys)) {
      // this.nextHandler();
      console.log('next');
    } else if (keysPressed(prevKeys)) {
      console.log('prev');
    }
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
        <div className="butthurt-container selectable horizontal layout" style={getStyle(butthurt.interval)}>
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
        <div id="background" className="horizontal layout">
          <div className="sidebar"></div>
          <div className="flex"></div>
        </div>
        <div className="fit layout vertical center">
          <div className="butthurt-container selectable horizontal layout">
            <div className="side">
              <h1>Now</h1>
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
      </div>
    )
  }
})

React.render(
  <App />,
  document.getElementById('app')
);