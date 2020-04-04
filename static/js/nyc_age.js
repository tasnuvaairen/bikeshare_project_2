d3.json("/nyc_data_july", function(data){

    console.log("july")
    console.log(data)
    

    riders_age=[[],[],[],[],[],[],[],[],[],[],[]]

    for(i=0;i<data.trips.length;i++){
        age=2019-data.trips[i].birth_year;
        
        if(age<20){
            riders_age[0]++;
        }
        else if(age<25){
            riders_age[1]++;
        }
        else if(age<30){
            riders_age[2]++;
        }
        else if(age<35){
            riders_age[3]++;
        }
        else if(age<40){
            riders_age[4]++;
        }
        else if(age<45){
            riders_age[5]++;
        }
        else if(age<50){
          riders_age[6]++;
      }
        else if(age<55){
            riders_age[7]++;
        }
        else if(age<60){
            riders_age[8]++;
        }
        else if(age<65){
            riders_age[9]++;
        }
        else {riders_age[10]++}

    }
    console.log(riders_age)
   
    
  
    var chart = new Chartist.Bar('.ct-chart', {
        labels: ['<20', '20-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50-55','55-60', '60-65', '>65'],
        series: riders_age
        
      }, {
        low: 0,
        width: '100rem',
        height: '40rem',
        distributeSeries: true,
      
        plugins: [
            
              Chartist.plugins.ctAxisTitle({
                axisX: {
                  axisTitle: "Trip Duration(mins)",
                  //axisClass: "ct-axis-title-test",
                  offset: {
                    x: 0,
                    y: 50
                  },
                  textAnchor: "middle"
                },
                axisY: {
                  axisTitle: "Number of Trips",
                  axisClass: "ct-axis-title-test2",
                  offset: {
                    x: 0,
                    y: -1
                  },
                  flipTitle: false
                }
              })
        ]
        
    }
      );
      
})