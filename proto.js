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
      	this.data = arr.splice(i,arr.length);
        this.ready = true;
      }
    }
  }

  per_day_data(arr = this.data, arr2 = []) {
    for (var i = 0; i < arr.length; i++) {
      if (i === arr.length -1) {
      	this.daily_data = arr2
        this.ready = true;
        break
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

  async fetch(url,call) {
  	const actualdata = await $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      cache: false,
      async:true,
    });
    this.data = actualdata;
    return eval(call);
  }

  draw_chart(arr) {
  }
  render() {
    this.canvas.render()
  }
  doughnutChart(id,percentage) {
    this.canvas = new CanvasJS.Chart(id, {
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
  splineArea() {
    return new CanvasJS.Chart("page-views-spline-area-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        maximum: new Date("1 Dec 2015"),
        minimum: new Date("1 Jan 2015"),
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
            { x: new Date("1 Jan 2015"), y: 2171991 },
            { x: new Date("1 Feb 2015"), y: 2678910 },
            { x: new Date("1 Mar 2015"), y: 3215487 },
            { x: new Date("1 Apr 2015"), y: 2213754 },
            { x: new Date("1 May 2015"), y: 2584561 },
            { x: new Date("1 Jun 2015"), y: 3178647 },
            { x: new Date("1 Jul 2015"), y: 3645041 },
            { x: new Date("1 Aug 2015"), y: 2914568 },
            { x: new Date("1 Sep 2015"), y: 3985421 },
            { x: new Date("1 Oct 2015"), y: 3754219 },
            { x: new Date("1 Nov 2015"), y: 3971047 },
            { x: new Date("1 Dec 2015"), y: 4121538 }
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
window.onload = function () {
  const chart1 = new covid();
  chart1.fetch('https://covid-19-greece.herokuapp.com/all',
   'this.ignore_early_dates(this.data.cases)')
  fetchinterval1 = setInterval(function(){
    if (chart1.ready === true) {
      console.log(chart1.data)
      chart1.ready = false
      chart1.per_day_data()
      clearInterval(fetchinterval1)
      datainterval1 = setInterval(function(){
        if (chart1.ready === true) {
          chart1.ready = false
          console.log(chart1.daily_data)
          clearInterval(datainterval1)
        }
      },50)
    }
  },50)


  //firstchart.doughnutChart("infected-doughnut-chart")
  const chart2 = new covid();
  chart2.fetch('https://covid-19-greece.herokuapp.com/regions-history',
   'this.per_day_data(this.data["regions-history"])')
  fetchinterval2 = setInterval(function(){
    if (chart2.ready === true) {
      console.log(chart2.daily_data)
      chart2.ready = false
      clearInterval(fetchinterval2)
      // datainterval2 = setInterval(function(){
      //   if (chart2.ready === true) {
      //     chart2.ready = false
      //     console.log(chart2.daily_data)
      //     clearInterval(datainterval2)
      //   }
      // },50)
    }
  },100)

  //firstchart.render()
  // firstchart.render()
}


$('.inview').one('inview', function (e, isInView) {
  if (isInView) {
    switch (this.id) {
      case "infected-doughnut-chart": firstchart.render();
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
