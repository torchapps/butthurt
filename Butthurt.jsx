var React = require("react");

var Butthurt = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  render: function() {
    var getStyle = function(interval) {
      return {
        'minHeight': interval * 20 + "px"
      }
    };
    var data = this.props.data;

    return (
      <div className="butthurt-container selectable horizontal layout" style={getStyle(data.interval)}>
        <div className="side">
          <div className="month">
            {data.date.format("MMM")}
          </div>
          <div className="day">
            {data.date.format("DD")}
          </div>
          <div className="year">
            {data.date.format("YYYY")}
          </div>
        </div>
        <div className="main flex">
          <p>
            {data.desc}
          </p>
          <a className="inline" href={data.src}>Source</a>
        </div>
      </div>
    );
  }
});

module.exports = Butthurt;