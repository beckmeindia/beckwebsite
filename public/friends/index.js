	var ntfnd = 0; var center;var firebaseRef = new Firebase("https://beckme.firebaseio.com");
	var geoFire = new GeoFire(firebaseRef.child("_geopckgs")); var geoQuery = geoFire.query({ center: [18.936023, 72.834920],  radius: 30});
	var vehiclesInQuery = {}; var img64; var autoflag=0; var deliveryFare, pickuplat,pickuplng, delvlat, delvlng, description=" ", pickuparea, pickupaddr, pickupname, pickupnum, deliveryaddr, deliveryarea, deliverynum, deliveryname,deliverydate,deliverytime, pckgvalue = "Less than Rs. 5000", pckgweight = "1 Kg - 2 Kgs",pckgsize = "SMALL (FITS IN BAG)";
	var pfare, psize, pweight, ppickup, ppickupaddr, pdelv,pdelvaddr,pdatetym,pckgimg,imagz, pusrid, pusrphn, porderid;
	var loggedin=0,usrname="",usremail="",usrphone="",usrid="", fbflag=0, usrnewmail="";
	var otp = Math.floor((Math.random() * 900) + 1000); var locerr = 0;
	
	function exit(){
		swal({   title: "Are you sure?",   text: "You will lose the data you added for this request",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, go back!",   closeOnConfirm: true }, function(){   myNavigator.popPage('page1.html', { animation : 'lift' } ); google.maps.event.trigger(map, 'resize'); });
	}
	
	function mailcall(custName,custEmail,custPhone){
	$.ajax({
      url: 'https://www.beckme.in/request.php',
      data:
      {
        name : custName,
		email : custEmail,
		phoneno : custPhone
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}
	
	$(document).on({
    'DOMNodeInserted': function() {
		$('.pac-item, .pac-item span', this).addClass('needsclick');
    }
	}, '.pac-container');
	/*
	$(function() {
		setTimeout(function(){
			if(loggedin==0){}
    var tour = new Tour({
        storage: false,
		
        steps: [
            {
    element: "#locasion", // element selector to show the popover next to;
    title: "Package locations",
	placement: "bottom",
	backdrop:true,
    content: "Search various places to see packages there"
  },
  {
    element: "#map", // element selector to show the popover next to;
    title: "Packages",
	backdrop:true,
    content: "The live packages appear here. Click on the marker to see details"
  },
  {
    element: "#add",
    title: "New Request",
	placement: "bottom",
	backdrop:true,
    content: "You can post a request if you want to send"
  },
  {
    element: "#fblogin",
    title: "Login",	
	placement: "bottom",
	backdrop:true,
    content: "Finally, login for posting with us"
  }
        ]
    }).init().start(true);    
});
	},2000);
	
	$(function(){
	// Create a new tour
	tour = new Tour({backdrop: true,storage:false});
 
// Add your steps
tour.addSteps([
  {
    element: "#locasion", // element selector to show the popover next to;
    title: "Package locations",
	placement: "bottom",
    content: "Search various places to see packages there"
  },
  {
    element: "#map", // element selector to show the popover next to;
    title: "Packages",
    content: "The live packages appear here. Click on the marker to see details"
  },
  {
    element: "#add",
    title: "New Request",
	placement: "bottom",
    content: "You can post a request if you want to send"
  },
  {
    element: "#fblogin",
    title: "Login",	
	placement: "bottom",
    content: "Finally, login for posting with us"
  }
]);
 
// Initialize method on the Tour class. Get's everything loaded up and ready to go.
tour.init();
 
// This starts the tour itself

	})
*/
	function openaccept(){
		imagz="";
		myNavigator.pushPage('page4.html', { animation : 'push' } );
		setTimeout(function(){
		document.getElementById("pflfare").innerHTML = pfare;
		document.getElementById("psizewt").innerHTML = pweight+" "+psize;
		document.getElementById("pflpickarea").innerHTML = ppickup;
		document.getElementById("pflpickaddr").innerHTML = ppickupaddr;
		document.getElementById("pfldelv").innerHTML = pdelv;
		document.getElementById("pfldelvaddr").innerHTML = pdelvaddr;
		document.getElementById("pfldtym").innerHTML = pdatetym;
		firebaseRef.child("packages").child(pckgimg).child("img").once("value", function(dataSnapshot) {
			imagz = dataSnapshot.child("img64").val();
			$("#pflbckg").css("background-image", "url('" + imagz + "')");
		});
		},500);
	}
	
	geoQuery.on("key_entered", function(vehicleId, vehicleLocation) {
	vehiclesInQuery[vehicleId] = true;

	// Look up the vehicle's data in the Transit Open Data Set
	firebaseRef.child("packages").child(vehicleId).child("order").once("value", function(dataSnapshot) {
    // Get the vehicle data from the Open Data Set
    vehicle = dataSnapshot.val();
	//console.log(vehicle);
    // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
    // Set, add it to the map
    if (vehicle !== null && vehiclesInQuery[vehicleId] === true) {
      // Add the vehicle to the list of vehicles in the query
      vehiclesInQuery[vehicleId] = vehicle;
      // Create a new marker for the vehicle
      vehicle.marker = createVehicleMarker(vehicle,vehicleId);
	  vehicle.fare = dataSnapshot.child("fare").val(); vehicle.size = dataSnapshot.child("pckgsize").val(); vehicle.weight = dataSnapshot.child("pckgweight").val(); vehicle.pckimg = dataSnapshot.child("id").val();
	vehicle.pickup = dataSnapshot.child("pickuparea").val(); vehicle.pickupaddr = dataSnapshot.child("pickupaddr").val(); vehicle.delv = dataSnapshot.child("deliveryarea").val();
	vehicle.delvaddr = dataSnapshot.child("deliveryaddr").val(); vehicle.datetym = "By " + dataSnapshot.child("deliverytime").val()+" on "+dataSnapshot.child("deliverydate").val();

    }
  });
  
});
function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

/* Removes vehicle markers from the map when they exit the query */
geoQuery.on("key_exited", function(vehicleId, vehicleLocation) {
  
  var vehicle = vehiclesInQuery[vehicleId];

  // If the vehicle's data has already been loaded from the Open Data Set, remove its marker from the map
  if (vehicle !== true) {
    vehicle.marker.setMap(null);
  }

  // Remove the vehicle from the list of vehicles in the query
  delete vehiclesInQuery[vehicleId];
});
	
	
	function getLocation() {	
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,onerror);
    } else { 
	//      alert("Your location could not be found, please use autocomplete");		
    }
	}
	
	function createVehicleMarker(vehicle,vehicleId) {
	var marker = new google.maps.Marker({
    position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
    optimized: true,
	icon: "package.png",
    map: map
	});
	
	google.maps.event.addListener(marker, 'click', function () {
	map.setCenter(marker.getPosition());
	document.getElementById("pfare").innerHTML = vehicle.fare;
	document.getElementById("psize").innerHTML = vehicle.size;
	document.getElementById("pdatetym").innerHTML = vehicle.datetym;
	document.getElementById("ppickup").innerHTML = vehicle.pickup;
	
	document.getElementById("pdelv").innerHTML = vehicle.delv;
	document.getElementById("rqstgist").style.display="block";
	pusrid = vehicle.usrname; pusrphn = vehicle.usrphone; porderid = vehicle.id;
	pfare = vehicle.fare; psize= vehicle.size; pweight= vehicle.weight; pckgimg = vehicle.pckimg;
	ppickup = vehicle.pickup; ppickupaddr = vehicle.pickupaddr; pdelv = vehicle.delv;
	pdelvaddr = vehicle.delvaddr; pdatetym = vehicle.datetym;
	});
	
	return marker;
	}
	
	function insurance(){
		if (document.getElementById('chkbx').checked) {
      document.getElementById('chkval').innerHTML = "More than Rs. 5000";
	  pckgvalue = "More than Rs. 5000";
		} else { document.getElementById('chkval').innerHTML = "Less than Rs. 5000";
		pckgvalue = "Less than Rs. 5000";
		}
	}
	
	function showVal(newVal){
		var cars = ["","Less than 1 Kg", "1 Kg - 2 Kgs", "2 Kgs to 10 Kgs", "10 Kgs - 20 Kgs", "Above 20 Kgs"];
		document.getElementById("rangeText").innerHTML=cars[newVal]; pckgweight = cars[newVal];
	}
	

	function showPosition(position) {
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		map.setZoom(11); ntfnd = 0;
		getReverseGeocodingData(position.coords.latitude, position.coords.longitude);	
		locerr = 1;	
	}
   
   
	function onerror(err){
		ntfnd = 1;
		if(err.code==1){
			loadauto2();
		}		
	}
	
	function loadauto2(){
	myNavigator.pushPage('page5.html', { animation : 'none' } );	
	setTimeout(function(){
	document.getElementById('pac-input2').focus();		
	var input = (document.getElementById('pac-input2'));
	var autocomplete = new google.maps.places.Autocomplete(input);
	
	autocomplete.addListener('place_changed', function() {
	var place = autocomplete.getPlace();
	if (!place.geometry) {
		swal({   title: "Location Error",   text: "Sorry could not find the location. Please search again",   type: "error",   confirmButtonText: "OK" });
      //alert("Sorry could not find the location. Please search again");
      return;
    }
   
	center = place.geometry.location;    
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
		(place.address_components[1] && place.address_components[1].short_name || ''), 
        (place.address_components[2] && place.address_components[2].short_name || '')      
      ].join(' ');
	  
		document.getElementById("locasion").innerHTML=address;
	  myNavigator.popPage('page5.html', { animation : 'none' } );	
	  setTimeout(function(){
		  google.maps.event.trigger(map, 'resize');
		  map.setCenter(center);map.setZoom(11); ntfnd=0;
		  geoQuery.updateCriteria({center: [center.lat(), center.lng()]});
		  if(loggedin==0){
			var tour = new Tour({
        storage: false,		
        steps: [
            {
    element: "#locasion", // element selector to show the popover next to;
    title: "Package locations",
	placement: "bottom",
	backdrop:true,
    content: "Search various places to see packages there"
  },
  {
    element: "#map", // element selector to show the popover next to;
    title: "Packages",
	backdrop:true,
    content: "The live packages appear here. Click on the marker to see details"
  },
  {
    element: "#add",
    title: "New Request",
	placement: "bottom",
	backdrop:true,
    content: "You can post a request if you want to send"
  },
  {
    element: "#fblogin",
    title: "Login",	
	placement: "bottom",
	backdrop:true,
    content: "Finally, login for posting with us"
  }
        ]
    }).init().start(true);    
		  }
		 // 
	  },1500)
    }	
	});		
	},1500);	
	}	
	
	var img="";
	function loadauto(){
		document.getElementById("rqstgist").style.display="none";
		myNavigator.pushPage('page3.html', { animation : 'lift' } );	
		
	setTimeout(function(){
	document.getElementById('pac-input').focus();
	var input = (document.getElementById('pac-input'));
	var autocomplete = new google.maps.places.Autocomplete(input);
	
	autocomplete.addListener('place_changed', function() {
	
	var place = autocomplete.getPlace();
	if (!place.geometry) {
	swal({   title: "Location Error",   text: "Sorry could not find the location. Please search again",   type: "error",   confirmButtonText: "OK" });
     // alert("Sorry could not find the location. Please search again");
      return;
    }
   
	center = place.geometry.location;    
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
		(place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')      
      ].join(' ');
	  if(autoflag==0)
	  {
		document.getElementById("locasion").innerHTML = document.getElementById("pac-input").value;
	  myNavigator.popPage('page3.html', { animation : 'lift' } );	
	  setTimeout(function(){
		  google.maps.event.trigger(map, 'resize');
		  map.setCenter(center);map.setZoom(11); ntfnd=0;
		  geoQuery.updateCriteria({center: [center.lat(), center.lng()]});
	  },1500)
	}
	else if(autoflag==1){
		document.getElementById("pickuparea").value=document.getElementById("pac-input").value;;
		pickuplat = center.lat(); pickuplng = center.lng();
		myNavigator.popPage('page3.html', { animation : 'lift' } );	
	}
	else if(autoflag==2){
		document.getElementById("deliveryarea").value=document.getElementById("pac-input").value;;
		delvlat = center.lat(); delvlng = center.lng();
		 myNavigator.popPage('page3.html', { animation : 'lift' } );
	}
    }	
	});	
	
	},1000);
	
	}
	
	function startauto(){
		autoflag=0;
		loadauto()
	}
	
	function pickupauto(){
		autoflag=1;
		loadauto()
	}
	
	function delvauto(){
		autoflag=2;
		loadauto()
	}
	
	var farebrk = 0;
	function showfarebreak(){
		/*
		if(farebrk==0){
		document.getElementById("farebrkheader").innerHTML = "FARE BREAKDOWN";
		document.getElementById("farebreakdown").style.display="block";
		farebrk = 1;
		}
		else{
			document.getElementById("farebrkheader").innerHTML = "SHOW FARE BREAKDOWN";
		document.getElementById("farebreakdown").style.display="none";
		farebrk = 0;
		}
		*/
	}
	function receipt(){
		phoneNumDelv = document.getElementById("deliverynum").value.replace(/[^\d]/g, '');
		if(document.getElementById('deliveryarea').value=="" || document.getElementById('deliveryname').value=="" || document.getElementById('deliverynum').value=="" || document.getElementById('deliveryaddr').value==""){
			swal({   title: "DELIVERY DETAILS",   text: "Please fill all Pickup Details",   type: "error",   confirmButtonText: "OK" });
			//alert("Please fill all Pickup Details first")
		}		
		else if(phoneNumDelv.length != 10) {
			swal({   title: "INVALID MOBILE NO.",   text: "Please fill a valid phone number at delivery location",   type: "error",   confirmButtonText: "OK" });
			//alert("Please fill a valid phone number at pickup location")
		}
		else if(img===undefined || img == ""){
			swal({   title: "ADD PACKAGE PHOTO",   text: "Please add photo of your package at the top",   type: "error",   confirmButtonText: "OK" });
		//	alert("Please add photo of your package at the top")		
		}
		
		else{
			deliveryarea = document.getElementById("deliveryarea").value;
			deliveryname = document.getElementById("deliveryname").value;
			deliverynum = document.getElementById("deliverynum").value;
			deliveryaddr = document.getElementById("deliveryaddr").value;
			deliverydate = document.getElementById("myDate").value;
			deliverytime = document.getElementById("myTime").value;
			
			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var firstDate = new Date(today);
			var secondDate = new Date(deliverydate);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
					
			var distance = Number(GeoFire.distance([pickuplat,pickuplng], [delvlat,delvlng]));			
			if(distance<=2000){	
		var pickupLocation = pickuplat+", "+pickuplng; var deliveryLocation = delvlat+", "+delvlng;
		var request = {
       origin: pickupLocation, 
       destination: deliveryLocation,
       travelMode: google.maps.DirectionsTravelMode.DRIVING 
   };	
	directionsService.route(request, function(response, status) {
	
	if (status == google.maps.DirectionsStatus.OK) { 
		var route = Number(response.routes[0].legs[0].distance.value);
	if(distance<=60){	
		if(diffDays==0){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(route*0.008));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare="Rs. "+String(Math.round(route*0.01));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare="Rs. "+String(Math.round(route*0.014));
				}
				else{
					fare="Rs. "+String(Math.round(route*0.024));
				}				
			}
			else if(diffDays>=1 && diffDays<=3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(route*0.007));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare="Rs. "+String(Math.round(route*0.009));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare="Rs. "+String(Math.round(route*0.012));
				}
				else{
					fare="Rs. "+String(Math.round(route*0.021));
				}				
			}else if(diffDays>3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(route*0.005));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare="Rs. "+String(Math.round(route*0.007));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare="Rs. "+String(Math.round(route*0.008));
				}
				else{
					fare="Rs. "+String(Math.round(route*0.015));
				}					
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(route*0.004));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare="Rs. "+String(Math.round(route*0.005));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare="Rs. "+String(Math.round(route*0.007));
				}
				else{
					fare="Rs. "+String(Math.round(route*0.012));
				}					
			}
	}
	else{
	if(diffDays==0){
			
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*1.5));
				}				
				else{
					fare="GET A QUOTE";
				}				
			}
			else if(diffDays>0 && diffDays<=7){
				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*1));
				}
				else{
					fare="GET A QUOTE";
				}					
			}else{
				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*0.5));
				}
				else{
					fare="GET A QUOTE";
				}					
			}
	}   
   }})						
			}else{
			if(diffDays<3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*0.75));
				}else{
					fare="GET A QUOTE";
				}				
			}
			else if(diffDays>=3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*0.5));
				}else{
					fare="GET A QUOTE";
				}				
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare="Rs. "+String(Math.round(distance*0.25));
				}else{
					fare="GET A QUOTE";
				}				
			}
			};	
			myNavigator.pushPage('page2.html', { animation : 'push' } );
			setTimeout(function(){
				showfarebreak();
				document.getElementById("fare").innerHTML=fare;
				document.getElementById("card2").style.backgroundImage = img;
				document.getElementById("pickupareasumm").innerHTML = pickuparea;
				document.getElementById("pickupdetsumm").innerHTML = pickupaddr;
				document.getElementById("delvareasumm").innerHTML = deliveryarea;
				document.getElementById("delvdetsumm").innerHTML = deliveryaddr;
				document.getElementById("datetymsumm").innerHTML =  deliverytime+" on "+deliverydate;
			},2000)			
		}
		
	}
		var phoneNumPick, phoneNumDelv;
	function showdelivery(){
		phoneNumPick = document.getElementById("pickupnum").value.replace(/[^\d]/g, '');
		if(document.getElementById('pickuparea').value=="" || document.getElementById('pickupname').value=="" || document.getElementById('pickupnum').value=="" || document.getElementById('pickupaddr').value==""){
			swal({   title: "PICKUP DETAILS",   text: "Please fill all Pickup Details",   type: "error",   confirmButtonText: "OK" });
			//alert("Please fill all Pickup Details first")
		}		
		else if(phoneNumPick.length != 10) {
			swal({   title: "INVALID MOBILE NO.",   text: "Please fill a valid phone number at pickup location",   type: "error",   confirmButtonText: "OK" });
			//alert("Please fill a valid phone number at pickup location")
		}
		else{
		pickuparea = document.getElementById("pickuparea").value;
		pickupname = document.getElementById("pickupname").value;
		pickupnum = document.getElementById("pickupnum").value;
		pickupaddr = document.getElementById("pickupaddr").value;
		document.getElementById("packagedetails").style.display="none";
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="block";
		document.getElementById("timebtn").style.background="#00b100";		
		document.getElementById("pickupbtn").style.background="#00b100";
		document.getElementById("deliverybtn").style.background="#00b100";
		document.getElementById("timedetails").style.display="none";
		}		
	}
	
	function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          //  alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            var address = (results[0].formatted_address);
			document.getElementById("locasion").innerHTML = address;
			
        }
    });
	}
	
	function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
	}
	
	function tConvert (time) {
	// Check correct time format and split into components
	time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join (''); // return adjusted time or original string
	}
	
	function reformatDate(dateStr){
	dArr = dateStr.split("-");  // ex input "2010-01-18"
	return dArr[2]+ "/" +dArr[1]+ "/" +dArr[0]; //ex out: "18/01/10"
	}
	
	
	var fbflag,clicklogin=0;
	function post2(){		
		//usrnewmail = "rahulbasu.710@gmail.com";	checkfirebase(usrnewmail);	
		if(loggedin==1){
		post();
		}
		else{
			fbflag = 1;
			//swal("Not Loggedin", "Please Login first!");
			login();			
		}		
	}
	
	function checkfirebase(email){		
		usrnewmail = String(email).replace(/[^a-zA-Z0-9]/g, ' ');
		firebaseRef.child("users").once("value", function(snapshot) {			
			if(snapshot.hasChild(usrnewmail)){
				usrname = snapshot.child(usrnewmail).child("usrname").val();
				usremail=  snapshot.child(usrnewmail).child("usremail").val();
				usrphone = snapshot.child(usrnewmail).child("usrphone").val();
				usrid = snapshot.child(usrnewmail).child("usrid").val();
				//alert(usrname+" "+usremail+" "+usrphone+" "+usrid);
				fbflag = 0; loggedin = 1;				
			}else if(clicklogin==1){				
				swal({title: "Mobile Verification", text: "Enter your 10 digit mobile number",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Type your number here" }, 
				function(inputValue){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {     swal.showInputError("Please Enter a valid 10 digit mobile number");     return false   }
				otpcall(inputValue);
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				firebaseRef.child("users").child(usrnewmail).update({
					usrname:usrname, usremail:usremail, usrid:usrnewmail, usrphone:inputValue
				});				
				usrphone = inputValue;
				usrid = usrnewmail;				
				swal("Verification Succesful", "Congratulations. You are succesfully registered with BECK!", "success"); 
				loggedin = 1;
				
				});
				});				
			}; 			
		});
	}
	
		
	function otpcall(number){
	//	alert(otp);
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : otp + ' is your OTP (One Time Password) for Beck. Please use the password to complete your Registration.'
      },
      error: function(error) {
      console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}
	
	function accept(){	
	clicklogin=1;
	if(loggedin==1){
		smsacceptdm(pusrphn);
		smsacceptsupp(usrphone);
		var actionz = "BECK friend "+ usrname +" accepted a new order: " + porderid;
		mailcall(actionz,usremail,usrphone);	
		setTimeout(function(){
		myNavigator.popPage('page4.html', { animation : 'none' } );
		google.maps.event.trigger(map, 'resize');
		document.getElementById("rqstgist").style.display="none";
		swal("Succesfully Accepted", "The details of the request you accepted has been sent you through SMS.", "success")
		},1500);
		}
		else{
			fbflag = 1;
			
			//swal("Not Loggedin", "Please Login first!");
			login();			
		}			
	}
	
	function smsacceptdm(number){	
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+usrname+'. You can reach him at '+usrphone
      },
      error: function(error) {
      console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}
	
	function smsacceptsupp(number){	
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+pusrid+'. You can reach him at '+pusrphn
      },
      error: function(error) {
      console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}
	

	function post(){	
		//alert(usrid+" "+usrphone+" "+usrname+" "+usremail);
		myNavigator.pushPage('request.html', { animation : 'none' } );
		var orderid = makeid();
		deliverydate = reformatDate(deliverydate);
		deliverytime = tConvert(deliverytime);	
		if(document.getElementById("descriptor").value != ""){
			description = document.getElementById("descriptor").value;
		}
		geoFire.set(orderid, [pickuplat, pickuplng]).then(function() {}, function(error) {
		swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		//alert("Oops. There was an error in posting your request, please try again");
		});
		firebaseRef.child("packages").child(orderid).update({order:{description:description,id:orderid,lat:pickuplat,lon:pickuplng,usrid:usrid,usrphone:usrphone,usrname:usrname,usremail:usremail,pickuplat:pickuplat,pickuplng:pickuplng, delvlat:delvlat, delvlng:delvlng, pickuparea:pickuparea, pickupaddr:pickupaddr, pickupname:pickupname, pickupnum:pickupnum, deliveryaddr:deliveryaddr, deliveryarea:deliveryarea, deliverynum:deliverynum, deliveryname:deliveryname,deliverydate:deliverydate,deliverytime:deliverytime, pckgvalue:pckgvalue, pckgweight:pckgweight,pckgsize:pckgsize,fare:fare}},function(error){
		if (error) {
			swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		} else {
			var actionz = "BECK friend "+ usrname +" requested a new order: " + orderid;
			mailcall(actionz,usremail,usrphone);
		}
		});
		firebaseRef.child("packages").child(orderid).update({img:{img64:img64}});
		setTimeout(function(){
		myNavigator.popPage('request.html', { animation : 'none' } );
		myNavigator.popPage('page2.html', { animation : 'none' } );
		myNavigator.popPage('page1.html', { animation : 'none' } );
		setTimeout(function(){
		google.maps.event.trigger(map, 'resize');
		swal("Succesfully Posted", "Your Request is posted at the pickup location. We shall update you soon!", "success")
		},1000)	
		},5500);			
	}
	
	var today;
	function showdatetym(){
		if(pckgsize==""){
			swal({   title: "PACKAGE SIZE",   text: "Please mention the SIZE of your package",   type: "error",   confirmButtonText: "OK" });
		}
		else if(img==""){
			swal({   title: "PACKAGE IMAGE",   text: "Please add an IMAGE of your package",   type: "error",   confirmButtonText: "OK" });
		}
		else{
		today = new Date().toISOString().slice(0, 10);
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("packagedetails").style.display="none";
		document.getElementById("timedetails").style.display="block";
		document.getElementById("timebtn").style.background="#00b100";		
		document.getElementById("pickupbtn").style.background="#fff";
		document.getElementById("deliverybtn").style.background="#fff";
		document.getElementById('myDate').valueAsDate = new Date();
		document.getElementById("myDate").min = document.getElementById("myDate").value;
		}
		
	}
	
	function addnewrqst(){
		
		document.getElementById('rqstgist').style.display='none'; myNavigator.pushPage('page1.html', { animation : 'push' } );
		setTimeout(function(){img = ""; pckgsize=""},1000);
	}
	
	function showpickup(){
		
		if(document.getElementById('myDate').value=="" || document.getElementById('myTime').value==""){
			swal({   title: "Date & Time",   text: "Please fill a date and time for the delivery of your package",   type: "error",   confirmButtonText: "OK" });
		//	alert("Please fill a date and time for the delivery of your package")
		}else if(today > document.getElementById('myDate').value){
			swal({   title: "Previous Date",   text: "You cannot select a previous date for delivery",   type: "error",   confirmButtonText: "OK" });
			//alert("You cannot select a previous date for deivery")
		}
		else if((isValidDate(document.getElementById('myDate').value)) == false){swal({   title: "Invalid Date",   text: "Please select an appropriate date type for delivery",   type: "error",   confirmButtonText: "OK" });}
		else{
		document.getElementById("packagedetails").style.display="none";		
		document.getElementById("pickupbtn").style.background="#00b100";
		document.getElementById("timebtn").style.background="#00b100";
		document.getElementById("pickupdetails").style.display="block";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("deliverybtn").style.background="#fff";	
		document.getElementById("timedetails").style.display="none";
		}						
	}
	
	function showpckg(){		
		document.getElementById("pickupbtn").style.background="#fff";
		document.getElementById("timebtn").style.background="#fff";
		document.getElementById("packagedetails").style.display="block";
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("deliverybtn").style.background="#fff";	
		document.getElementById("timedetails").style.display="none";				
	}
	
	var reader;
	function card(){
	document.getElementById("files").onchange = function () {
    reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
		img64 = String(e.target.result);
		img = "url('"+e.target.result+"')";
		document.getElementById("packagephoto").style.display = "none";
        document.getElementById("card").style.backgroundImage = img;
    };
    reader.readAsDataURL(this.files[0]);
	};
	}
	
	function lala(){
	$(window).scrollTop($(window).scrollTop()+1);
	setTimeout(function(){	
		$("#pickupname").focus();			
	},500);
	
	document.getElementById('pickupname').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#pickupaddr").focus();
        }
    });
	document.getElementById('pickupaddr').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#pickupnum").focus();
        }
    });
	document.getElementById('pickupnum').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            showdelivery()
        }
    });
	}

	function lala2(){
	setTimeout(function(){
		$("#deliveryname").focus();
	},500);
	
	document.getElementById('deliveryname').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#deliveryaddr").focus();
        }
    });
	document.getElementById('deliveryaddr').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#deliverynum").focus();
        }
    });
	document.getElementById('deliverynum').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			 receipt()
        }
    });
	}

