total = 'https://covid-19-greece.herokuapp.com/all'
recovered = 'https://covid-19-greece.herokuapp.com/recovered'

function int_from_date(date) {
  return date.split('-').join('')
}

  
class covid {
	constructor(chart) {
  	this.start_int = int_from_date('2020-02-26')
    this.chart = chart;
  }

  ignore_early_dates(arr) {
    arr = arr.cases
    for (var i = 0; i < arr.length; i++) {
      if (this.start_int === int_from_date(arr[i].date)) {
      	this.draw_chart(arr.splice(i,arr.length))
      }
    }
  }
 
  async update_charts(url) {
  	const actualdata = await $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      cache: false,
      async:true,
    });
    this.ignore_early_dates(actualdata)
  }
  
  draw_chart(arr) {
  	console.log(arr) // todo with this.chart
  }

  run() {
    this.update_charts(total)
	}
}

const firstchart = new covid('dummy');
firstchart.run(total);
