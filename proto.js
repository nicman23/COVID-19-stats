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
    for (var i = 0; i < arr.length +1; i++) {
      if (i === arr.length ) {
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
    for (var i = 1; i < arr.length +1; i++) {
      arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].confirmed});
    }
    return arr2;
  }
  split_total_daily_data_2(arr, arr2 = []) {
    for (var i = 1; i < arr.length +1; i++) {
      arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].deaths});
    }
    return arr2;
  }
  split_total_daily_data_3(arr, arr2 = []) {
    for (var i = 1; i < arr.length +1; i++) {
      arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].intensive_care});
    }
    return arr2;
  }
  split_total_daily_data_4(arr, arr2 = []) {
    for (var i = 1; i < arr.length +1; i++) {
      arr2.push({y: arr[i-1].region_cases, label:arr[i-1].region_en_name});
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
  doughnutSexChart(id,dataPoints) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        text: "",
      },
      data: [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "##0.00\"%\"",
		indexLabel: "{label} {y}",
		dataPoints: dataPoints
	}]
    });
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
    return new CanvasJS.Chart(id, {
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

      data: [
        {
          color: "#424242",
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
var state_Chart;

const covidInst = new covid();
window.onload = function () {
  covidInst.fetch('https://covid-19-greece.herokuapp.com/regions-history', async (data) => {
    this.regions = await data["regions-history"];
    this.regionsDaily = await this.per_day_data(this.regions);
    state_Chart = this.stateChart("users-countries-bar-chart",this.split_total_daily_data_4(this.regions[this.regions.length-1].regions))
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/gender-distribution', async (data) => {
    this.gender_percentages = await data["gender_percentages"];
    var sex_dist = [];
    sex_dist.push({y: this.gender_percentages.total_males_percentage, label: "Males Percentage"});
    sex_dist.push({y: this.gender_percentages.total_females_percentage, label: "Females Percentage"});
    state_Chart = this.doughnutSexChart("sex-doughnut-chart",sex_dist)
    state_Chart.render()
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/age-distribution', async (data) => {
    this.age_distribution = await data["age_distribution"];
    //console.log(this.age_distribution.total_age_groups.cases["0-17"])
    var age_dist_cases = [];
    var total = this.age_distribution.total_age_groups.cases["0-17"]+this.age_distribution.total_age_groups.cases["18-39"]+this.age_distribution.total_age_groups.cases["40-64"]+this.age_distribution.total_age_groups.cases["65+"]
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["0-17"]/total)*100, label: "0-17"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["18-39"]/total)*100, label: "18-39"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["40-64"]/total)*100, label: "40-64"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["65+"]/total)*100, label: "65+"});
    state_Chart = this.doughnutSexChart("age-cases-doughnut-chart",age_dist_cases)
    state_Chart.render()

    var age_dist_critical = [];
    var total = this.age_distribution.total_age_groups.critical["0-17"]+this.age_distribution.total_age_groups.critical["18-39"]+this.age_distribution.total_age_groups.critical["40-64"]+this.age_distribution.total_age_groups.critical["65+"]
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["0-17"]/total)*100, label: "0-17"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["18-39"]/total)*100, label: "18-39"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["40-64"]/total)*100, label: "40-64"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["65+"]/total)*100, label: "65+"});
    state_Chart = this.doughnutSexChart("age-critical-doughnut-chart",age_dist_critical)
    state_Chart.render()

    var age_dist_deaths = [];
    var total = this.age_distribution.total_age_groups.deaths["0-17"]+this.age_distribution.total_age_groups.deaths["18-39"]+this.age_distribution.total_age_groups.deaths["40-64"]+this.age_distribution.total_age_groups.deaths["65+"]
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["0-17"]/total)*100, label: "0-17"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["18-39"]/total)*100, label: "18-39"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["40-64"]/total)*100, label: "40-64"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["65+"]/total)*100, label: "65+"});
    console.log(age_dist_deaths)
    state_Chart = this.doughnutSexChart("age-deaths-doughnut-chart",age_dist_deaths)
    state_Chart.render()
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/intensive-care', async (data) => {
    this.cases = await data["cases"];
    spline_Area = this.splineArea("daily-critical-infections-area-chart",this.split_total_daily_data_3(this.cases))
    spline_Area.render()
    document.getElementById("daily-critical-infections").innerHTML = this.cases[this.cases.length-1].intensive_care;
    document.getElementById("daily-critical-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.cases[this.cases.length-1].intensive_care)*100)/this.cases[this.cases.length-14].intensive_care)*10/10+"%";
    document.getElementById("daily-critical-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.cases[this.cases.length-1].intensive_care)*100)/this.cases[this.cases.length-30].intensive_care)*10/10+"%";

  })

  covidInst.fetch('https://covid-19-greece.herokuapp.com/all', async (data) => {
    this.all = await this.ignore_early_dates(data.cases)
    //
    document.getElementById("new-cases").innerHTML = this.all[this.all.length-1].confirmed-this.all[this.all.length-2].confirmed;
    document.getElementById("last-updated").innerHTML = "Last updated: "+this.all[this.all.length-1].date

    document.getElementById("total-infections").innerHTML = this.all[this.all.length-1].confirmed;
    document.getElementById("total-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.all[this.all.length-1].confirmed)*100)/this.all[this.all.length-14].confirmed)*10/10+"%";
    document.getElementById("total-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.all[this.all.length-1].confirmed)*100)/this.all[this.all.length-30].confirmed)*10/10+"%";
    document.getElementById("total-deaths").innerHTML = this.all[this.all.length-1].deaths;
    document.getElementById("total-deaths-14").innerHTML = "Change 14 days: " + Math.floor(((this.all[this.all.length-1].deaths)*100)/this.all[this.all.length-14].deaths)*10/10+"%";
    document.getElementById("total-deaths-30").innerHTML = "Change 30 days: " + Math.floor(((this.all[this.all.length-1].deaths)*100)/this.all[this.all.length-30].deaths)*10/10+"%";
    //
    inf_per_chart = this.doughnutChart("infected-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / population)*1000) / 1000);
    inf_per_chart.render();
    herd_chart = this.doughnutChart("herd-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / (population*0.7))*1000) / 1000);
    herd_chart.render();
    fatality_chart = this.doughnutChart("fatality-doughnut-chart", Math.floor((this.all[this.all.length-1].deaths / (this.all[this.all.length-1].confirmed))*100000) / 1000);
    fatality_chart.render();
    this.allDaily = await this.per_day_data(this.all);
    //
    document.getElementById("daily-infections").innerHTML = this.allDaily[this.allDaily.length-1].confirmed;
    document.getElementById("daily-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].confirmed)*100)/this.allDaily[this.allDaily.length-14].confirmed)*10/10+"%";
    document.getElementById("daily-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].confirmed)*100)/this.allDaily[this.allDaily.length-30].confirmed)*10/10+"%";
    document.getElementById("daily-infections").innerHTML = this.allDaily[this.allDaily.length-1].confirmed;
    document.getElementById("daily-deaths").innerHTML = this.allDaily[this.allDaily.length-1].deaths;
    document.getElementById("daily-deaths-14").innerHTML = "Change 14 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].deaths)*100)/this.allDaily[this.allDaily.length-14].deaths)*10/10+"%";
    document.getElementById("daily-deaths-30").innerHTML = "Change 30 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].deaths)*100)/this.allDaily[this.allDaily.length-30].deaths)*10/10+"%";
    //
    spline_Area = this.splineArea("total-infections-spline-area-chart",this.split_total_daily_data(this.all))
    spline_Area.render()
    spline_Area = this.splineArea("total-deaths-spline-area-chart",this.split_total_daily_data_2(this.all))
    spline_Area.render()
    spline_Area = this.splineArea("daily-infections-spline-area-chart",this.split_total_daily_data(this.allDaily))
    spline_Area.render()
    spline_Area = this.splineArea("daily-deaths-spline-area-chart",this.split_total_daily_data_2(this.allDaily))
    spline_Area.render()
  })

  $('.inview').one('inview', function (e, isInView) {
    if (isInView) {

      switch (this.id) {
        // case "infected-doughnut-chart": inf_per_chart.render();
        // break;
         case "herd-doughnut-chart": herd_chart.render();
         break;
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
               case "users-countries-bar-chart": state_Chart.render();
                 break;
        //       case "users-age-bar-chart": usersCountriesBarChart.render();
        //         break;
      }
    }
  });
}
