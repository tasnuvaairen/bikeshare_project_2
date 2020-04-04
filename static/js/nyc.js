d3.json("/nyc_data_jan", function(data){

    console.log("jan")
    console.log(data)

    riders_july=[[],[],[],[],[],[],[],[],[],[],[]]

    for(i=0;i<data.trips.length;i++){
        trip_july=data.trips[i];
        
        if(trip_july.duration<180){
            riders_july[0]++;
        }
        else if(trip_july.duration<300){
            riders_july[1]++;
        }
        else if(trip_july.duration<480){
            riders_july[2]++;
        }
        else if(trip_july.duration<600){
            riders_july[3]++;
        }
        else if(trip_july.duration<780){
            riders_july[4]++;
        }
        else if(trip_july.duration<960){
            riders_july[5]++;
        }
        else if(trip_july.duration<1200){
          riders_july[6]++;
      }
        else if(trip_july.duration<1500){
            riders_july[7]++;
        }
        else if(trip_july.duration<1800){
            riders_july[8]++;
        }
        else if(trip_july.duration<2100){
            riders_july[9]++;
        }
        else {riders_july[10]++}

    }
    console.log(riders_july) 
    d3.json("/nyc_data_apr", function(oct_data){
      console.log("apr")
      console.log(oct_data)

    riders_oct=[[],[],[],[],[],[],[],[],[],[],[]]

    for(i=0;i<oct_data.trips.length;i++){
        trip_oct=oct_data.trips[i];
        
        if(trip_oct.duration<180){
          riders_oct[0]++;
      }
      else if(trip_oct.duration<300){
          riders_oct[1]++;
      }
      else if(trip_oct.duration<480){
          riders_oct[2]++;
      }
      else if(trip_oct.duration<600){
          riders_oct[3]++;
      }
      else if(trip_oct.duration<780){
          riders_oct[4]++;
      }
      else if(trip_oct.duration<960){
          riders_oct[5]++;
      }
      else if(trip_oct.duration<1200){
        riders_oct[6]++;
    }
      else if(trip_oct.duration<1500){
          riders_oct[7]++;
      }
      else if(trip_oct.duration<1800){
          riders_oct[8]++;
      }
      else if(trip_oct.duration<2100){
          riders_oct[9]++;
      }
      else {riders_oct[10]++}

    }
   console.log(riders_oct) 
   d3.json("/nyc_data_july", function(jan_data){
    console.log("julyt")
    console.log(jan_data)

  riders_jan=[[],[],[],[],[],[],[],[],[],[],[]]

  for(i=0;i<jan_data.trips.length;i++){
      trip_jan=jan_data.trips[i];
      
      if(trip_jan.duration<180){
        riders_jan[0]++;
    }
    else if(trip_jan.duration<300){
        riders_jan[1]++;
    }
    else if(trip_jan.duration<480){
        riders_jan[2]++;
    }
    else if(trip_jan.duration<600){
        riders_jan[3]++;
    }
    else if(trip_jan.duration<780){
        riders_jan[4]++;
    }
    else if(trip_jan.duration<960){
        riders_jan[5]++;
    }
    else if(trip_jan.duration<1200){
      riders_jan[6]++;
  }
    else if(trip_jan.duration<1500){
        riders_jan[7]++;
    }
    else if(trip_jan.duration<1800){
        riders_jan[8]++;
    }
    else if(trip_jan.duration<2100){
        riders_jan[9]++;
    }
    else {riders_jan[10]++}

  }
 console.log(riders_jan) 

 d3.json("/nyc_data_oct", function(apr_data){
  console.log("oct")
  console.log(apr_data)

riders_apr=[[],[],[],[],[],[],[],[],[],[],[]]

for(i=0;i<apr_data.trips.length;i++){
    trip_apr=apr_data.trips[i];
    
    if(trip_apr.duration<180){
      riders_apr[0]++;
  }
  else if(trip_apr.duration<300){
      riders_apr[1]++;
  }
  else if(trip_apr.duration<480){
      riders_apr[2]++;
  }
  else if(trip_apr.duration<600){
      riders_apr[3]++;
  }
  else if(trip_apr.duration<780){
      riders_apr[4]++;
  }
  else if(trip_apr.duration<960){
      riders_apr[5]++;
  }
  else if(trip_apr.duration<1200){
    riders_apr[6]++;
}
  else if(trip_apr.duration<1500){
      riders_apr[7]++;
  }
  else if(trip_apr.duration<1800){
      riders_apr[8]++;
  }
  else if(trip_apr.duration<2100){
      riders_apr[9]++;
  }
  else {riders_apr[10]++}

}
console.log(riders_apr) 
   
  
  var chart = new Chartist.Line(
    ".ct-chart",
    {
      labels: ['<3', '3-5', '5-8', '8-10', '10-13', '13-16', '16-20', '20-25','25-30', '30-35', '>35'],
    series: [riders_jan, riders_apr, riders_july, riders_oct]
    },
    {
      low: 0,
      width: '100rem',
      height: '40rem',
      chartPadding: {
        top: 50,
        right: 0,
        bottom: 25,
        left: 20
      },
      axisY: {
        onlyInteger: true
      },
      
      plugins: [
        Chartist.plugins.legend({

            legendNames: ['January','April', 'July', 'October'],
        }),
        [
          Chartist.plugins.ctAxisTitle({
            axisX: {
              axisTitle: "Trip Duration(mins)",
              axisClass: "ct-axis-title-test",
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
    ]
    }
  );
  // Let's put a sequence number aside so we can use it in the event callbacks
  var seq = 0,
    delays = 80,
    durations = 500;
  
  // Once the chart is fully created we reset the sequence
  chart.on('created', function() {
    seq = 0;
  });
  
  // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
  chart.on('draw', function(data) {

    
    seq++;
  
    if(data.type === 'line') {
      // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
      data.element.animate({
        opacity: {
          // The delay when we like to start the animation
          begin: seq * delays + 1000,
          // Duration of the animation
          dur: durations,
          // The value where the animation should start
          from: 0,
          // The value where it should end
          to: 1
        }
      });
    } else if(data.type === 'label' && data.axis === 'x') {
      data.element.animate({
        y: {
          begin: seq * delays,
          dur: durations,
          from: data.y + 100,
          to: data.y,
          // We can specify an easing function from Chartist.Svg.Easing
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'label' && data.axis === 'y') {
      data.element.animate({
        x: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 100,
          to: data.x,
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'point') {
      data.element.animate({
        x1: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart'
        },
        x2: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart'
        },
        opacity: {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'grid') {
      // Using data.axis we get x or y which we can use to construct our animation definition objects
      var pos1Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '1'] - 30,
        to: data[data.axis.units.pos + '1'],
        easing: 'easeOutQuart'
      };
  
      var pos2Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '2'] - 100,
        to: data[data.axis.units.pos + '2'],
        easing: 'easeOutQuart'
      };
  
      var animations = {};
      animations[data.axis.units.pos + '1'] = pos1Animation;
      animations[data.axis.units.pos + '2'] = pos2Animation;
      animations['opacity'] = {
        begin: seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart'
      };
  
      data.element.animate(animations);
    }
  });
})
})
})
})