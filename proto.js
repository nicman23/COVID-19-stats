total = 'https://covid-19-greece.herokuapp.com/all'
recovered = 'https://covid-19-greece.herokuapp.com/recovered'

function int_from_date(date) {
  return date.split('-').join('')
}

class covid {
	constructor() {
  	this.start_int = int_from_date('2020-02-26')
    this.ready = false
  }

  ignore_early_dates(arr = this.data) {
    for (var i = 0; i < arr.length; i++) {
      if (this.start_int === int_from_date(arr[i].date)) {
      	return arr.splice(i,arr.length);
      }
    }
  }

  per_day_data(arr, arr2 = []) {
    for (var i = 0; i < arr.length; i++) {
      if (i === arr.length -1) {
      	return arr2
      } else if (i === 0) {
        arr2[i] = []
        Object.keys(arr[i]).forEach(function(z) {
          arr2[i][z] = arr[i][z];
        })
      } else {
        arr2[i] = this.day_data(arr[i], arr[i-1])
      }
    }
  }

  split_total_daily_data(arr, arr2 = []) {
    for (var i = 0; i < arr.length; i++) {
      arr2.push({x: new Date(arr[i].date), y: arr[i].confirmed});
    }
    return arr2;
  }
  split_total_daily_data_2(arr, arr2 = []) {
    for (var i = 0; i < arr.length; i++) {
      arr2.push({x: new Date(arr[i].date), y: arr[i].deaths});
    }
    return arr2;
  }

  day_data(arr, prev_arr, arr2 =[]) {
    var actualthis = this
    Object.keys(arr).forEach(function(z) {
      if (typeof arr[z] === "string") {
        arr2[z] = arr[z];
      } else if (typeof arr[z] === "number" || arr[z] === null) {
        arr2[z] = arr[z] - prev_arr[z];
      } else {
        arr2[z] = actualthis.day_data(arr[z], prev_arr[z])
      }
    });
    return arr2;
  }

  fetchWrap(data,call,rando = Math.random().toString(36).substr(2, 5)) {
    this[rando] = eval(call)
    this[rando](data)
    delete(this[rando])
  }

  fetch(url, call) {
    this.asd = true
    var actualthis = this
  	$.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      cache: false,
      success: function(data) {
        actualthis.fetchWrap(data,call.toString())
      }
    });
  }

  draw_chart(arr) {
  }
  render() {
    this.canvas.render()
  }
  doughnutChart(id,percentage) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        fontColor: "#848484",
        fontSize: 70,
        horizontalAlign: "center",
        text: percentage + "%",
        verticalAlign: "center"
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          explodeOnClick: false,
          innerRadius: "96%",
          radius: "90%",
          startAngle: 270,
          type: "doughnut",
          dataPoints: [
            { y: percentage, color: "#c70000", toolTipContent: null },
            { y: 100 - percentage, color: "#424242", toolTipContent: null }
          ]
        }
      ]
    });
  }
  splineArea(id,dataPoints) {
    console.log(dataPoints[0].x,dataPoints[dataPoints.length-1].x)
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        minimum: dataPoints[0].x,
        maximum: dataPoints[dataPoints.length-1].x,
        tickLength: 0,
        valueFormatString: " "
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickLength: 0,
        valueFormatString: " "
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          color: "#424242",
          fillOpacity: 1,
          lineColor: "#ffffff",
          lineThickness: 3,
          markerSize: 0,
          type: "splineArea",
          dataPoints: dataPoints
        }
      ]
    });
  }

  totalGraph(id,dataPoints) {
    // CanvasJS doughnut chart to show annual users - new and returning
    // var usersDoughnutChart = new CanvasJS.Chart("users-doughnut-chart", {
    //   animationEnabled: true,
    //   backgroundColor: "transparent",
    //   toolTip: {
    //     backgroundColor: "#000000",
    //     borderThickness: 2,
    //     cornerRadius: 0,
    //     fontColor: "#ffffff",
    //     contentFormatter: function (e) {
    //       return e.entries[0].dataPoint.name + ": " + CanvasJS.formatNumber(e.entries[0].dataPoint.y, '###,###') + " - " + Math.round(e.entries[0].dataPoint.y / totalUsers * 100) + "%"; // calcuting and showing percentage of users inside tooltip
    //     }
    //   },
    //   data: [
    //     {
    //       innerRadius: "82%",
    //       radius: "100%",
    //       showInLegend: false,
    //       startAngle: 180,
    //       type: "doughnut",
    //       dataPoints: [
    //         { y: 1921757, name: "Total Infections", color: "#c70000" },
    //         { y: 5765279, name: "Tests Conducted", color: "#424242", exploded: true }
    //       ]
    //     }
    //   ]
    // });

    // CanvasJS spline chart to show users - new and returning from Jan 2015 - Dec 2015
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        lineColor: "#bbbbbb"
      },
      axisY: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        logarithmic: true,
        title: "Number of people (Log)",
        lineColor: "#bbbbbb"
      },
      legend: {
        dockInsidePlotArea: true,
        fontColor: "#ffffff",
        fontSize: 16,
        horizontalAlign: "right",
        verticalAlign: "top"
      },
      toolTip: {
        backgroundColor: "#000000",
        borderThickness: 2,
        cornerRadius: 0,
        fontColor: "#ffffff",
        shared: true
      },
      data: [
        {
          color: "#424242",
          legendMarkerType: "square",
          legendText: "Tests Conducted",
          name: "Tests Conducted",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[0]
        },
        {
          color: "#424242",
          legendMarkerType: "square",
          legendText: "Deaths",
          name: "Deaths",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[1]
        },
        {
          color: "#c70000",
          legendMarkerType: "square",
          legendText: "Total Infections",
          name: "Total Infections",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[2]
        }
      ]
    });
  }

  stateChart(id,dataPoints) {
    new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 12,
        labelAngle: 0,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.label + ": " +  CanvasJS.formatNumber(Math.round(e.entries[0].dataPoint.y / 100 * totalUsers), '###,###'); // calculating and showing country wise number of users inside tooltip
        }
      },
      data: [
        {
          color: "#424242",
          indexLabelFontColor: "#f7f6f6",
          indexLabelFontFamily: "calibri",
          indexLabelFontSize: 18,
          indexLabelPlacement: "outside",
          type: "column",
          dataPoints: dataPoints
        }
      ]
    });
  }

  ageChart(id,dataPoints) {
    return CanvasJS.Chart("users-age-bar-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 12,
        labelAngle: 0,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.label + ": " +  CanvasJS.formatNumber(Math.round(e.entries[0].dataPoint.y / 100 * totalUsers), '###,###'); // calculating and showing country wise number of users inside tooltip
        }
      },
      data: [{
        type: "column",
        showInLegend: true,
        name: "Infections",
        color: "grey",
        dataPoints: dataPoint[0]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Critical",
        color: "blue",
        dataPoints: dataPoint[1]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Death",
        color: "red",
        dataPoints: dataPoint[2]
      }]
    });
  }
}
const population = 10720000;
var inf_per_chart;
var herd_chart;
var fatality_chart;
var spline_Area;

const covidInst = new covid();
window.onload = function () {
  covidInst.fetch('https://covid-19-greece.herokuapp.com/regions-history', async (data) => {
    this.regions = await data["regions-history"];
    this.regionsDaily = await this.per_day_data(this.regions);
  })

  covidInst.fetch('https://covid-19-greece.herokuapp.com/all', async (data) => {
    this.all = await this.ignore_early_dates(data.cases)
    inf_per_chart = this.doughnutChart("infected-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / population)*1000) / 1000);
    inf_per_chart.render();
    herd_chart = this.doughnutChart("herd-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / (population*0.7))*1000) / 1000);
    herd_chart.render();
    fatality_chart = this.doughnutChart("fatality-doughnut-chart", Math.floor((this.all[this.all.length-1].deaths / (this.all[this.all.length-1].confirmed))*1000) / 1000);
    fatality_chart.render();
    this.allDaily = await this.per_day_data(this.all);
    spline_Area = this.splineArea("total-infections-spline-area-chart",this.split_total_daily_data(this.all))
    spline_Area.render()
    spline_Area = this.splineArea("total-deaths-spline-area-chart",this.split_total_daily_data_2(this.all))
    spline_Area.render()
  })

  $('.inview').one('inview', function (e, isInView) {
    if (isInView) {
      console.log(isInView)
      switch (this.id) {
        // case "infected-doughnut-chart": inf_per_chart.render();
        // break;
        // case "herd-doughnut-chart": herd_chart.render();
        // break;
        // case "fatality-doughnut-chart": fatality_chart.render();
        // break;
        //       case "sales-doughnut-chart-nl": salesDoughnutChartNL.render();
        //         break;
        //       case "sales-doughnut-chart-de": salesDoughnutChartDE.render();
        //         break;
        //       case "page-views-spline-area-chart": pageViewsSplineAreaChart.render();
        //         break;
        //       case "orders-spline-area-chart": ordersSplineAreaChart.render();
        //         break;
        //       case "revenue-spline-area-chart": revenueSplineAreaChart.render();
        //         break;
        //       case "users-doughnut-chart": usersDoughnutChart.render();
        //         break;
        //       case "users-spline-chart": usersSplineChart.render();
        //         break;
        case "users-countries-bar-chart": spline_Area.render();
        break;
        //       case "users-age-bar-chart": usersCountriesBarChart.render();
        //         break;
      }
    }
  });
}
