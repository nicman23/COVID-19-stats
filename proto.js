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

<<<<<<< Updated upstream
=======
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
  split_total_daily_data_3(arr, arr2 = []) {
    for (var i = 0; i < arr.length; i++) {
      arr2.push({x: arr[i].region_en_name, y: arr[i].region_cases});
      console.log(arr2)
    }
    return arr2;
  }
>>>>>>> Stashed changes
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
    console.log(percentage)
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        fontColor: "#848484",
        fontSize: 68,
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
  splineArea() {
    return new CanvasJS.Chart("page-views-spline-area-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        maximum: new Date(infd_1),
        minimum: new Date(infd_6),
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
          dataPoints: [
            { x: new Date(infd_6), y: inf_6 },
            { x: new Date(infd_5), y: inf_5 },
            { x: new Date(infd_4), y: inf_4 },
            { x: new Date(infd_3), y: inf_3 },
            { x: new Date(infd_2), y: inf_2 },
            { x: new Date(infd_1), y: inf_1 }
          ]
        }
      ]
    });
  }

  totalGraph() {
    // CanvasJS doughnut chart to show annual users - new and returning
    var usersDoughnutChart = new CanvasJS.Chart("users-doughnut-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      toolTip: {
        backgroundColor: "#000000",
        borderThickness: 2,
        cornerRadius: 0,
        fontColor: "#ffffff",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.name + ": " + CanvasJS.formatNumber(e.entries[0].dataPoint.y, '###,###') + " - " + Math.round(e.entries[0].dataPoint.y / totalUsers * 100) + "%"; // calcuting and showing percentage of users inside tooltip
        }
      },
      data: [
        {
          innerRadius: "82%",
          radius: "100%",
          showInLegend: false,
          startAngle: 180,
          type: "doughnut",
          dataPoints: [
            { y: 1921757, name: "Total Infections", color: "#c70000" },
            { y: 5765279, name: "Tests Conducted", color: "#424242", exploded: true }
          ]
        }
      ]
    });

    // CanvasJS spline chart to show users - new and returning from Jan 2015 - Dec 2015
    return new CanvasJS.Chart("users-spline-chart", {
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
          dataPoints: [
            { x: new Date("1 Jan 2015"), y: 325799 },
            { x: new Date("1 Feb 2015"), y: 401837 },
            { x: new Date("1 Mar 2015"), y: 482323 },
            { x: new Date("1 Apr 2015"), y: 332063 },
            { x: new Date("1 May 2015"), y: 387684 },
            { x: new Date("1 Jun 2015"), y: 476797 },
            { x: new Date("1 Jul 2015"), y: 546756 },
            { x: new Date("1 Aug 2015"), y: 437186 },
            { x: new Date("1 Sep 2015"), y: 597813 },
            { x: new Date("1 Oct 2015"), y: 563133 },
            { x: new Date("1 Nov 2015"), y: 595657 },
            { x: new Date("1 Dec 2015"), y: 618231 }
          ]
        },
        {
          color: "#424242",
          legendMarkerType: "square",
          legendText: "Deaths",
          name: "Deaths",
          showInLegend: true,
          type: "line",
          dataPoints: [
            { x: new Date("1 Jan 2015"), y: 500 },
            { x: new Date("1 Feb 2015"), y: 600 },
            { x: new Date("1 Mar 2015"), y: 700 },
            { x: new Date("1 Apr 2015"), y: 32063 },
            { x: new Date("1 May 2015"), y: 87684 },
            { x: new Date("1 Jun 2015"), y: 76797 },
            { x: new Date("1 Jul 2015"), y: 46756 },
            { x: new Date("1 Aug 2015"), y: 37186 },
            { x: new Date("1 Sep 2015"), y: 97813 },
            { x: new Date("1 Oct 2015"), y: 63133 },
            { x: new Date("1 Nov 2015"), y: 95657 },
            { x: new Date("1 Dec 2015"), y: 18231 }
          ]
        },
        {
          color: "#c70000",
          legendMarkerType: "square",
          legendText: "Total Infections",
          name: "Total Infections",
          showInLegend: true,
          type: "line",
          dataPoints: [
            { x: new Date("1 Jan 2015"), y: 108599 },
            { x: new Date("1 Feb 2015"), y: 133945 },
            { x: new Date("1 Mar 2015"), y: 160774 },
            { x: new Date("1 Apr 2015"), y: 110688 },
            { x: new Date("1 May 2015"), y: 129228 },
            { x: new Date("1 Jun 2015"), y: 158932 },
            { x: new Date("1 Jul 2015"), y: 182252 },
            { x: new Date("1 Aug 2015"), y: 145728 },
            { x: new Date("1 Sep 2015"), y: 199271 },
            { x: new Date("1 Oct 2015"), y: 187711 },
            { x: new Date("1 Nov 2015"), y: 198552 },
            { x: new Date("1 Dec 2015"), y: 206077 }
          ]
        }
      ]
    });
  }

  stateChart(id,dataPoints) {
    new CanvasJS.Chart("users-countries-bar-chart", {
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
          dataPoints: [
            { y: 10,  indexLabel: "2%",  label: "East Macedonia & Thrace" },
            { y: 2,  indexLabel: "4%",  label: "Central Macedonia" },
            { y: 2,  indexLabel: "4%",  label: "Epirus" },
            { y: 2,  indexLabel: "4%",  label: "Thessaly" },
            { y: 2,  indexLabel: "4%",  label: "Ionian Islands" },
            { y: 2,  indexLabel: "4%",  label: "West Greece" },
            { y: 2,  indexLabel: "4%",  label: "Central Greece" },
            { y: 2,  indexLabel: "5%",  label: "Attica" },
            { y: 2, indexLabel: "12%", label: "Peloponnese" },
            { y: 2,  indexLabel: "9%",  label: "North Aegean" },
            { y: 4, indexLabel: "10%", label: "South Aegean" },
            { y: 8, indexLabel: "14%", label: "Crete" },
            { y: 60, indexLabel: "44%", label: "West Macedonia" }
          ]
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
        dataPoints: [
          { y: 22, label: "0-17" },
          { y: 16, label: "18-39" },
          { y: 22, label: "40-64" },
          { y: 29, label: "65+" }
        ]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Critical",
        color: "blue",
        dataPoints: [
          { y: 212, label: "0-17" },
          { y: 186, label: "18-39" },
          { y: 272, label: "40-64" },
          { y: 299, label: "65+" }
        ]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Death",
        color: "red",
        dataPoints: [
        { y: 112, label: "0-17" },
        { y: 86, label: "18-39" },
        { y: 172, label: "40-64" },
        { y: 199, label: "65+" }
        ]
      }]
    });
  }
}
const population = 10720000;
var inf_per_chart;
var herd_chart;
var fatality_chart;
<<<<<<< Updated upstream

// Total infections per location
var loc_chart;
var east_mac; // East Macedonia and Thrace
var cent_mac // Central Macedonia

// Total Infections Chart
var inf_chart;
var inf_1;
var infd_1
var inf_2;
var infd_2;
var inf_3;
var infd_3;
var inf_4;
var infd_4;
var inf_5;
var infd_5;
var inf_6;
var infd_6;
=======
var spline_Area;
var state_Chart;
>>>>>>> Stashed changes

const covidInst = new covid();
window.onload = function () {
  covidInst.fetch('https://covid-19-greece.herokuapp.com/regions-history', async (data) => {
    this.regions = await data["regions-history"];
    this.regionsDaily = await this.per_day_data(this.regions);
<<<<<<< Updated upstream
    east_mac = this.regions[this.regions.length-1].regions[0].region_cases
    cent_mac = this.regions[this.regions.length-2].regions[0].region_cases

=======
  //  state_Chart = this.stateChart("users-countries-bar-chart",this.all.region_cases)

    state_Chart = this.stateChart("users-countries-bar-chart",this.split_total_daily_data_3((this.regions[this.regions.length-1].regions)))
  //  console.log(this.regions[this.regions.length-1].regions)
  //  console.log(this.regions[this.regions.length-1].regions[0].region_en_name)
  //  state_Chart.render()
>>>>>>> Stashed changes
  })

  covidInst.fetch('https://covid-19-greece.herokuapp.com/all', async (data) => {
    this.all = await this.ignore_early_dates(data.cases)
    inf_per_chart = this.doughnutChart("infected-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / population)*1000) / 1000)
    console.log(this.all[this.all.length-1].confirmed )
    inf_per_chart.render();
    herd_chart = this.doughnutChart("herd-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / (population*0.7))*1000) / 1000)
    herd_chart.render();
    fatality_chart = this.doughnutChart("fatality-doughnut-chart", Math.floor((this.all[this.all.length-1].deaths / (this.all[this.all.length-1].confirmed))*1000) / 1000)
    fatality_chart.render();
    this.allDaily = await this.per_day_data(this.all)

// This needs to go inside a loop ofc
    inf_1 = this.all[this.all.length-1].confirmed;
    infd_1 = this.all[this.all.length-1].date;
    inf_2 = this.all[this.all.length-14].confirmed
    infd_2 = this.all[this.all.length-14].date
    inf_3 = this.all[this.all.length-28].confirmed
    infd_3 = this.all[this.all.length-28].date
    inf_4 = this.all[this.all.length-42].confirmed
    infd_4 = this.all[this.all.length-42].date
    inf_5 = this.all[this.all.length-56].confirmed
    infd_5 = this.all[this.all.length-56].date
    inf_6 = this.all[this.all.length-70].confirmed
    infd_6 = this.all[this.all.length-70].date
    inf_chart = this.splineArea("inf-chart",data)
    inf_chart.render();
  })



}

$('.inview').one('inview', function (e, isInView) {
  if (isInView) {
    switch (this.id) {
      case "infected-doughnut-chart": inf_per_chart.render();
        break;
      case "herd-doughnut-chart": herd_chart.render();
        break;
      case "fatality-doughnut-chart": fatality_chart.render();
        break;
      case "inf-chart": inf_chart.render();
        break;
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
//       case "users-countries-bar-chart": usersAgeBarChart.render();
//         break;
//       case "users-age-bar-chart": usersCountriesBarChart.render();
//         break;
    }
  }
});
