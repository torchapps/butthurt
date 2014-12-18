var App = React.createClass({
  getInitialState: function(){
    return {butthurts: []}
  },
  componentDidMount: function(){
    reqwest("data.csv", function(data){
      // console.log(data);
      var raw = Papa.parse(data);
      var labels = raw.data.shift();

      var results = _.chain(raw.data)
        .map(function (r){
          var o = {};
          for (var i in r) o[labels[i]] = r[i];
          o.date = new Date(o.date);
          return o;
        })
        .reverse()
        .forEach(function(r, index, list){
          if (list[index + 1]) {
            r.interval = r.date - list[index + 1].date;
          } else {
            r.interval = 0;
          }
        })
        .value();
      this.setState({butthurts: results});
    }.bind(this));
  },
  daysSinceDate: function(butthurtDate){
    // return Math.floor((new Date() - butthurtDate) / 1000 / 60 / 60 / 24);
    return this.dateInterval(new Date(), butthurtDate);
  },
  latestDate: function(butthurts){
    var date = _.chain(butthurts)
      .sortBy("date")
      .last()
      .value();
    return date ? date.date : null;
  }, 
  dateInterval: function(newDate, oldDate){
    return Math.floor(this.toDays(newDate - oldDate));
  },
  toDays: function(date){
    //date is in milliseconds
    return date / 1000 / 60 / 60 / 24;
  },
  render: function(){
    var daysSince = this.daysSinceDate(this.latestDate(this.state.butthurts));
    return (
      <div>
        <div id="background" className="horizontal layout">
          <div className="sidebar"></div>
          <div className="flex"></div>
        </div>
        <div className="fit layout vertical center">
          <div className="butthurt-container">
            <h1>{daysSince} days since last butthurt</h1>
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
      </div>
    )
  }
})

React.render(
  <App />,
  document.getElementById('app')
);