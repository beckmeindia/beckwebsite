	var ntfnd = 0; var center;var firebaseRef = new Firebase("https://beckrequest.firebaseio.com");
	var geoFire = new GeoFire(firebaseRef.child("_geopckgs")); var geoQuery = geoFire.query({center: [0,0],radius: 0});
	var vehiclesInQuery = {}; var img64=""; var autoflag=0; var deliveryFare, pickuplat,pickuplng, delvlat, delvlng, description=" ", pickuparea, pickupaddr, pickupname, pickupnum, deliveryaddr, deliveryarea, deliverynum, deliveryname,deliverydate,deliverytime, pckgvalue = "Less than Rs. 5000", pckgweight = "1 Kg - 10 Kgs",pckgsize = "SMALL (FITS IN BAG)";
	var pfare, psize, pweight, ppickup, ppickupaddr, pdelv,pdelvaddr,pdatetym,pckgimg,imagz, pusrid, pusrphn, porderid;
	var loggedin=0,usrname="",usremail="",usrphone="",usrid="", usrfbimg="", usrfbid="", fbflag=0, usrnewmail="";
	var otp; var locerr = 0; var hiname = 0; var acceptsloaded = 0; var fare =""; var conval = 1; var convcurr="INR";
	var clicklogin=0;
	var arrPckgs = []; var rsltshow = 0;  var arraccepts = []; var revrsdone = 0; var mycenter; var lognclckd = 0; var flgg=0;

angular.module('MyApp',['ngMaterial',"firebase"]).controller('AppCtrl', ["$scope", "$firebaseArray", 
function($scope, $firebaseArray) {
	$scope.imagePath = 'download.png';
  var imagePath = 'download.png';
   $scope.myDate = null;
   $scope.postarr = {"length":null};
  $scope.minDate = new Date(
      (new Date()).getFullYear(),
      (new Date()).getMonth(),
      (new Date()).getDate());
  $scope.maxDate = new Date(
      (new Date()).getFullYear(),
      (new Date()).getMonth() + 2,
      (new Date()).getDate());	 
	  	  
	  $scope.post2 = function(){
			if(img64==""){}else{
			if(loggedin==1){ 
			post();
			$scope.myDate = null;
			}	else{ befrlogin() };
			}			
		}	  
	  
	  $scope.accept2 = function(){
		clicklogin=1;
		if(loggedin==1){
		var interval = setInterval(function(){
		if(typeof usrid === 'undefined'){}
		else{
			$('body').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold">Accepting...</div>'); }
			});
		clearInterval(interval);
		firebaseRef.child("users").child(usrid).child("accepts").child(arrPckgs[rsltshow].id).update(arrPckgs[rsltshow]);
		firebaseRef.child("users").child(usrid).child("accepts").update({notification:"yes"});
		firebaseRef.child("users").child(arrPckgs[rsltshow].usrid).child("posts").update({notification:"yes"});
		firebaseRef.child("users").child(arrPckgs[rsltshow].usrid).child("posts").child(arrPckgs[rsltshow].id).child("acceptors").child(usrid).update({id:usrid,usrname:usrname,usrphone:usrphone, usrfbid:usrfbid, usrfbimg:usrfbimg}).then(function() {
		//smsacceptdm(arrPckgs[rsltshow].usrphn);smsacceptsupp(usrphone); var actionz = "BECK friend "+ usrname +" accepted a new order: " + arrPckgs[rsltshow].id; mailcall(actionz,usremail,usrphone);	
		$('body').plainOverlay('hide');
		swal("Succesfully Accepted", "The details of the request you accepted has been sent you through SMS", "success");
  		arraccepts.push(arrPckgs[rsltshow].id);
		rfrshresults(mycenter);		
		})			
		};		
		},2000);		
		}
		else{
			fbflag = 1;
			befrlogin();
		}
		};
		
		$scope.showprofile = function(value){
			window.open('http://www.fb.com/'+value.usrfbid,'_blank');
		}
		
		$scope.approvefrnd = function(val,idpckgmatch){			
			//needs to be checked
			if(val === undefined){
				swal("Select a BECK FRIEND", "Please select the BECK friend who would complete your request")
			}else{
				var actionz = "BECK friend "+ val.usrname +" was selected for order: " + idpckgmatch;
				//mailcall(actionz,val.id,val.usrphone);
				smsmatchsuppl(val.usrphone); 
				smsmatchdmnd(usrphone,val.usrname,val.usrphone);
				var otherid = val.id;				
				firebaseRef.child("users").child(usrid).child("posts").child(idpckgmatch).update({"status":"Approved & Completed"});
				firebaseRef.child("users").child(otherid).child("accepts").child(idpckgmatch).update({"status":"Approved"}).then(function() {
				firebaseRef.child("users").child(usrid).child("posts").child(idpckgmatch).child("acceptors").remove();
				geoFire.remove(idpckgmatch);				
				swal("Succesfully Connected", "The details of the BECK Friend your approved for this request has been sent you through SMS", "success");
				});				
			}
		}
		
		var intervall = setInterval(function(){
		  if(loggedin == 1){
			clearInterval(intervall);	
			
			$scope.accepts = $firebaseArray(firebaseRef.child("users").child(usrid).child("accepts"));
			$scope.accepts.$loaded().then(function(arr){
				for (var key in arr) {
					if(arr[key].$id === undefined){}else{
					arraccepts.push(arr[key].$id);
					}
				}
				acceptsloaded = 1;
				/*
				if(arr.$getRecord("notification").$value == "no"){
					document.getElementById("notif1").style.display="none";
				}
				else{
					document.getElementById("notif1").style.display="inline";
					document.getElementById("notif").style.display="inline";
				}
				*/
			});
			$scope.posts = $firebaseArray(firebaseRef.child("users").child(usrid).child("posts"));
			$scope.posts.$loaded().then(function(arr){
				var interval = setInterval(function(){
					if(revrsdone==1){
					clearInterval(interval);
					for (var key in arr) {
					if(arr[key].$id === undefined || arr[key].fare == 'GET QUOTE'){}else{
					arr[key].fare = convcurr+" "+ Math.round(Number(arr[key].fare)/conval);
					}
					}				
					}					
					$scope.$apply(function() {
					$scope.postarr = arr;
					});
				},1500);
				/*				
				if(arr.$getRecord("notification").$value == "no"){
					document.getElementById("notif2").style.display="none";					
				}
				else{
					document.getElementById("notif2").style.display="inline";
					document.getElementById("notif").style.display="inline";
				}
				*/
			});
		  }
		},2000);	
}])
.config(function($mdDateLocaleProvider) {
	var initdt = "Delivery Date";
    $mdDateLocaleProvider.formatDate = function(date) {      
	   if(moment(date).format('ll')=="Invalid date"){
		   deliverydate="";
		   return initdt;
	   }else{
		    deliverydate = moment(date).format('DD/MM/YYYY');
		   return moment(date).format('ll');	
	   }
	      
    };
});


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
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	
  function smsacceptdm(number){
	if(String(number).substring(0, 2) == '91'){
	  $.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can approve his request from your profile'
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can approve his request from your profile'
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	}
	
	function rfrshresults(center){
		document.getElementById("pckgctr").innerHTML="Loading...";
			for (var i = 0; i < hotSpotMapMarkers.length; i++)
			hotSpotMapMarkers[i].setMap(null);
		  document.getElementById("rqstgist").style.display="none";
		  google.maps.event.trigger(map, 'resize');
		  rsltshow = 0;
		  if(path) path.setMap(null);
		  map.setCenter(center);map.setZoom(12); ntfnd=0;
		  geoQuery.updateCriteria({center: [center.lat(), center.lng()],radius:30});
    }
	
	function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
	    var findResult = function(results, name){
            var result =  _.find(results, function(obj){
                return obj.types[0] == name && obj.types[1] == "political";
            });
            return result ? result.short_name : null;
        };
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var address = (results[0].formatted_address);
			if(ntfnd==1) ntfnd=0;
			
			var country = findResult(results[0].address_components, "country");
			if(country == 'IN'){
				conval = 1; convcurr = "INR";
			}else if(country == "IT" || country == "GR" || country == "FR" || country == "ES" || country == "PL" || country == "BE" || country == "DE" ||country == "IE" || country == "PT" || country == "CH" || country == "TR" || country == "UA" || country == "DK" || country == "NL"){
				conval = 70; convcurr = "EUR";
			}else if(country == "GB"){
				conval = 90; convcurr = "GBP";
			}else if(country == "JP"){
				conval = 0.6; convcurr = "JPY";
			}else{
				conval = 60; convcurr = "USD";
			}
			revrsdone = 1;
        }
    });
	}
	
	function smsacceptsupp(number){	
	if(String(number).substring(0, 2) == '91'){
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(arrPckgs[rsltshow].usrname).split(" ")[0].substring(0, 10)+'. We will notify you once it has been approved. You can check the status from your profile.'
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+arrPckgs[rsltshow].split(" ")[0].usrname+'. We will notify you once it has been approved. You can check the status from your profile.'
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	}	
var nofkeys=0;
	geoQuery.on("key_entered", function(vehicleId, vehicleLocation) {
	vehiclesInQuery[vehicleId] = true;
	firebaseRef.child("packages").child(vehicleId).once("value", function(dataSnapshot) {
    vehicle = dataSnapshot.val();
	if (vehicle !== null && vehiclesInQuery[vehicleId] === true) {
    vehiclesInQuery[vehicleId] = vehicle;
	createVehicleMarker(vehicle,vehicleId);
	}	
	});
  });

	geoQuery.on("ready", function() {
	nofkeys = Object.keys(vehiclesInQuery).length;
	if(nofkeys==0 && geoQuery.radius()>1){
		if (geoQuery.radius()==15){
			geoQuery.updateCriteria({radius: 30});
		}else if (geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
			$('#map').plainOverlay('hide');
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 });
		document.getElementById("pckgctr").innerHTML = "No Requests Found"},3000);
		document.getElementById("rqstgist").style.display="none";
		}
		
	}
	var interval = setInterval(function(){
	if(arrPckgs.length == nofkeys && nofkeys!=0 && acceptsloaded==1){			
		clearInterval(interval);
		if(flgg==0)
		{
		$('#map').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:26px;color:#fff;font-weight:bold;text-align:center">Customizing Requests<br> for your account...</div>'); }
		});
			flgg=1;
		}
		for (var key in arraccepts) {forcekeyexit(arraccepts[key])};
		arrPckgs.sort(function(a, b) {
			if(String(b.fare).split(" ")[1]=="QUOTE"){
				return 0 - parseInt(Number(String(a.fare).split(" ")[1]));
			}else if(String(a.fare).split(" ")[1]=="QUOTE"){
				return parseInt(Number(String(b.fare).split(" ")[1])) - 0;
			}
			else{
				return parseInt(Number(String(b.fare).split(" ")[1])) - parseInt(Number(String(a.fare).split(" ")[1]));
			}		
		});
		nofkeys = arrPckgs.length;
		if(nofkeys==0){
			document.getElementById("pckgctr").innerHTML = "Searching More...";
			document.getElementById("rqstgist").style.display="none";
			rfrshresults(mycenter);
			for (var i = 0; i < hotSpotMapMarkers.length; i++)
			hotSpotMapMarkers[i].setMap(null);
		   google.maps.event.trigger(map, 'resize');
		  rsltshow = 0;
		  if(path) path.setMap(null);
		  map.setCenter(mycenter);map.setZoom(12);ntfnd=0;
			if(geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
			$('#map').plainOverlay('hide');
			document.getElementById("pckgctr").innerHTML = "No Requests Found";
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 })},3000);		
		}	
    	}else{
			$('#map').plainOverlay('hide');
			document.getElementById("prevbtn").style.display="none"; showreslt(0);
			drawroute(arrPckgs[0].pickuplat, arrPckgs[0].pickuplng, arrPckgs[0].delvlat, arrPckgs[0].delvlng);	
		}
		
	}	
	
	},3000);
	});	
	
	
	
	
	function forcekeyexit(vehicleId){
	var vehicle = vehiclesInQuery[vehicleId];
	if(vehicle !== undefined){
  if (vehicle !== true) {
   findAndRemove(arrPckgs, 'id', vehicleId);
  }
  delete vehiclesInQuery[vehicleId];
	}
}

geoQuery.on("key_exited", function(vehicleId, vehicleLocation) {
  forcekeyexit(vehicleId);  
})

$(document).ready(function(){
    $('#scrollDefaultExample').timepicker({ 'scrollDefault': 'now' });
	$("#demo01").animatedModal({animationDuration:'.3s'});
	$("#demo02").animatedModal({modalTarget:'acceptedModal',animationDuration:'.3s'});
	$("#demo03").animatedModal({modalTarget:'initModal',animationDuration:'.3s',animatedIn:'none',animatedOut:'fadeOutUp'});
	$("#demo03").trigger('click');	
	shwdetls();
            var win = $(window),
                foo = $('#typer');

            foo.typer(["Send anything anywhere economically.", "Earn as you travel"]);

});

	geoQuery.on("ready", function() {
	nofkeys = Object.keys(vehiclesInQuery).length;
	if(nofkeys==0 && geoQuery.radius()>1){
		if(geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
			$('#map').plainOverlay('hide');
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 })},3000);		
		}		
	}
	var interval = setInterval(function(){
	if(arrPckgs.length == nofkeys && nofkeys!=0){	
		clearInterval(interval);
		for (var key in arraccepts) {forcekeyexit(arraccepts[key])};
		arrPckgs.sort(function(a, b) {
			if(String(b.fare).split(" ")[1]=="QUOTE"){
				return 0 - parseInt(Number(String(a.fare).split(" ")[1]));
			}else if(String(a.fare).split(" ")[1]=="QUOTE"){
				return parseInt(Number(String(b.fare).split(" ")[1])) - 0;
			}
			else{
				return parseInt(Number(String(b.fare).split(" ")[1])) - parseInt(Number(String(a.fare).split(" ")[1]));
			}		
		});
		
		nofkeys = arrPckgs.length;
		if(nofkeys==0){
			document.getElementById("pckgctr").innerHTML = "No Requests Found";
			swal({   title: "No New Requests Here",   text: "You have accepted all requests near this location. Please come back later or continue searching for other locations.",   type: "error",   confirmButtonText: "OK" });
    	}else{
			document.getElementById("prevbtn").style.display="none"; showreslt(0);
			drawroute(arrPckgs[0].pickuplat, arrPckgs[0].pickuplng, arrPckgs[0].delvlat, arrPckgs[0].delvlng);	
		}
		
	}	
	
	},3000);
	});	
	
	function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
	}
	
	function post(){	
		$('body').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold">Posting...</div>'); }
		});
		var orderid = makeid();
		/*	
		if(document.getElementById("descriptor").value != ""){
			description = document.getElementById("descriptor").value;
		}
		*/
		firebaseRef.child("packages").child(orderid).update({order:{img64:img64,description:description,id:orderid,lat:pickuplat,lon:pickuplng,usrid:usrid,usrphone:usrphone,usrname:usrname,usremail:usremail,pickuplat:pickuplat,pickuplng:pickuplng, delvlat:delvlat, delvlng:delvlng, pickuparea:pickuparea, pickupaddr:pickupaddr, pickupname:pickupname, pickupnum:pickupnum, deliveryaddr:deliveryaddr, deliveryarea:deliveryarea, deliverynum:deliverynum, deliveryname:deliveryname,deliverydate:deliverydate,deliverytime:deliverytime, pckgvalue:pckgvalue, pckgweight:pckgweight,pckgsize:pckgsize,fare:fare}},function(error){
		if (error) {
			swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		} else {
			var actionz = "BECK friend "+ usrname +" requested a new order: " + orderid;
			//mailcall(actionz,usremail,usrphone);			
		}
		});
		var orderid2 = orderid+"D";
		firebaseRef.child("packages").child(orderid).update({img:{img64:img64}}).then(function() {
		firebaseRef.child("users").child(usrid).child("posts").child(orderid).update({status:"Waiting for Accept",img64:img64,description:description,id:orderid,lat:pickuplat,lon:pickuplng,usrid:usrid,usrphone:usrphone,usrname:usrname,usremail:usremail,pickuplat:pickuplat,pickuplng:pickuplng, delvlat:delvlat, delvlng:delvlng, pickuparea:pickuparea, pickupaddr:pickupaddr, pickupname:pickupname, pickupnum:pickupnum, deliveryaddr:deliveryaddr, deliveryarea:deliveryarea, deliverynum:deliverynum, deliveryname:deliveryname,deliverydate:deliverydate,deliverytime:deliverytime, pckgvalue:pckgvalue, pckgweight:pckgweight,pckgsize:pckgsize,fare:fare});
		firebaseRef.child("users").child(usrid).child("posts").update({notification:"yes"});
		geoFire.set(orderid, [pickuplat, pickuplng]).then(function() {}, function(error) {
		swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		});
		setTimeout(function(){
		rfrshresults(mycenter);
		google.maps.event.trigger(map, 'resize');
		document.getElementById("scrollDefaultExample").value="";deliverydate="";img64="";document.getElementById("searchloc3").value=""; document.getElementById("pickupnum").value=""; document.getElementById("pickupname").value=""; document.getElementById("pickupaddr").value="";document.getElementById("searchloc2").value=""; document.getElementById("deliverynum").value=""; document.getElementById("deliveryname").value=""; document.getElementById("deliveryaddr").value="";
		document.getElementById("packagephoto").style.display = "block";
		shwdetls();
		$("#card").css("background-image", "");
		$('body').plainOverlay('hide');
		swal("Succesfully Posted", "Your Request is posted at the pickup location. We shall update you soon!", "success");
		},1000)
		
		}, function(error) {
		swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		});	
			
	}
	
	function editnum(){
		if(loggedin==1){swal({   title: "Change number",   text: "Your present registered number is +"+usrphone+". Are you sure you want to change it?", html: true,   type: "warning",   showCancelButton: true,   confirmButtonColor: "#2bb1de",   confirmButtonText: "Change it",   closeOnConfirm: false }, function(){ smsending() })}else{befrlogin()};
	}
	
	function smsending(){
		if(loggedin==1){
				swal({title: "Mobile Verification", text: "", type: "input", closeOnConfirm: false, animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				if (String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, '')) == String(usrphone)) {swal.showInputError("Please do not enter the existing registered mobile number");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}
						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				firebaseRef.child("users").child(usrid).update({
					usrphone:intno
				});				
				usrphone = intno;
				swal("Update Succesful", "Congratulations. You have succesully updated your mobile number", "success"); 
				loggedin = 1;				
				});
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px; font-family:\'Maven Pro\', sans-serif;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');
			}
			else{
				befrlogin();
			}
	}
	
	function doClick(url) {
   if(loggedin==1)
       location.href = "#"+url;
   else
       befrlogin();
	}
	
	var today;
	function done(){
		pickupnum = document.getElementById("pickupnum").value;
		deliverynum = document.getElementById("deliverynum").value;
		 var phoneno = /^\d{10}$/;
		if(document.getElementById("searchloc3").value=="" || document.getElementById("pickupnum").value=="" || document.getElementById("pickupname").value=="" || document.getElementById("pickupaddr").value==""){
			sweetAlert("Pickup Details", "Please fill all the details at Pickup Location!", "error");
		}else if(document.getElementById("searchloc2").value=="" || document.getElementById("deliverynum").value=="" || document.getElementById("deliveryname").value=="" || document.getElementById("deliveryaddr").value==""){
			sweetAlert("Delivery Details", "Please fill all the details at Delivery Location!", "error");
		}else if(!pickupnum.match(phoneno)){
			sweetAlert("Pickup Contact", "Please fill a valid 10-digit number for Pickup Location contact number", "error");
		}else if(!deliverynum.match(phoneno)){
			sweetAlert("Delivery Contact", "Please fill a valid 10-digit number for Delivery Location contact number", "error");
		}else{	
			document.getElementById("lala").style.display = "none";	
			document.getElementById("delvlala").style.display = "none";	
			document.getElementById("prevbtn2").innerHTML = "EDIT DETAILS";			
			document.getElementById("fare").innerHTML = "Calculating...";
			document.getElementById("farediv").style.display="block";
			document.getElementById("postbtn").style.display="none";
			today = new Date().toISOString().slice(0, 10);
			deliveryarea = document.getElementById("searchloc2").value;
			deliveryname = document.getElementById("deliveryname").value;
			deliveryaddr = document.getElementById("deliveryaddr").value;
			pickuparea = document.getElementById("searchloc3").value;
			pickupname = document.getElementById("pickupname").value;
			pickupaddr = document.getElementById("pickupaddr").value;
			var oneDay = 24*60*60*1000;
			var firstDate = new Date(today);
			var frm = deliverydate.split("/");
			var secondDate = new Date(frm[2], frm[1] - 1, frm[0]);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));	
			var distance = -1; fare=0;
			distance = Number(GeoFire.distance([pickuplat,pickuplng], [delvlat,delvlng]));
			var distinterval = setInterval(function(){
			if(distance<0){}else{					
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
					fare=String(Math.round(route*0.008));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.01));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.014));
				}
				else{
					fare=String(Math.round(route*0.024));
				}				
			}
			else if(diffDays>=1 && diffDays<=3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.007));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.009));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.012));
				}
				else{
					fare=String(Math.round(route*0.021));
				}				
			}else if(diffDays>3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.005));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.007));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.008));
				}
				else{
					fare=String(Math.round(route*0.015));
				}					
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.004));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.005));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.007));
				}
				else{
					fare=String(Math.round(route*0.012));
				}					
				}
			}
			else{
			if(diffDays==0){			
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(200 + distance*0.75));
				}				
				else{
					fare="GET QUOTE";
				}				
			}
			else if(diffDays>0 && diffDays<=3){				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(175 + distance*0.5));
				}
				else{
					fare="GET QUOTE";
				}					
			}else if(diffDays>3 && diffDays<=7){				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(150 + distance*0.5));
				}
				else{
					fare="GET QUOTE";
				}					
			}else{				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(125 + distance*0.25));
				}
				else{
					fare="GET QUOTE";
				}					
			}
			}   
			}})	
			if(fare!=""){
				var newfrconv = "";
				if(fare!="GET QUOTE"){
				newfrconv = convcurr+" "+ Math.round(fare/conval);
				}
				else{
				newfrconv = "GET QUOTE";
				}
				document.getElementById("fare").innerHTML = newfrconv;	
				var imgbckz = new Image; imgbckz.src = img64;resizeImage(imgbckz);					
				clearInterval(distinterval);
			}						
			}else{
			if(diffDays<3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.75));
				}else{
					fare="GET QUOTE";
				}				
			}
			else if(diffDays>=3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.5));
				}else{
					fare="GET QUOTE";
				}			
			}else if(diffDays>7 && diffDays<=31){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.4));
				}else{
					fare="GET QUOTE";
				}				
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.25));
				}else{
					fare="GET QUOTE";
				}				
			}
			if(fare!=""){
				var newfrconv = "";
				if(fare!="GET QUOTE"){
				newfrconv = convcurr+" "+ Math.round(fare/conval);
				}
				else{
				newfrconv = "GET QUOTE";
				}
				document.getElementById("fare").innerHTML = newfrconv;
				var imgbckz = new Image; imgbckz.src = img64;resizeImage(imgbckz);								
				clearInterval(distinterval);
			}	
			};
			}
			},1000);
						
			}
	}
	
	function resizeImage(img) {
    img64 = imageToDataUri(img);
	document.getElementById("posting").style.display="block";
	}
	
	function imageToDataUri(img) {
	var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'); var wydt = 200 * img.width / img.height;
	canvas.width = wydt; canvas.height = 200;
    ctx.drawImage(img, 0, 0, wydt, 200);
    return canvas.toDataURL('image/jpeg', 0.7);
	}
	
	function next(){
		if(pckgsize==""||pckgweight==""|| document.getElementById("scrollDefaultExample").value==""||deliverydate==""){
			sweetAlert("Oops...", "Please fill all the package details!", "error");
		}else if(img64===undefined||img64==""){
			sweetAlert("Package Photo", "Please add a package photo!", "error");
		}else{
			document.getElementById("tytl").innerHTML = "Just one last step";		
			deliverytime = document.getElementById("scrollDefaultExample").value;			
			showprev2();
		}
	}
	var reader,img;
	function card(){	
	document.getElementById("files").onchange = function () {
    reader = new FileReader();
    reader.onload = function (e) {        
	img = "url('"+e.target.result+"')";  img64 = String(event.target.result);
		document.getElementById("packagephoto").style.display = "none";
        document.getElementById("card").style.backgroundImage = img;
		document.getElementById("card").style.backgroundSize = "contain"; document.getElementById("card").style.backgroundPosition = "center"; document.getElementById("card").style.backgroundRepeat = "no-repeat";
    };
    reader.readAsDataURL(this.files[0]);
	}	
	}
	
	function showreslt(i){
	if(i<nofkeys){
		document.getElementById("pckgctr").innerHTML = "Showing Result "+(i+1) +" of " + nofkeys;
	}
	if(nofkeys==1){
		document.getElementById("prevbtn").style.display="none"; document.getElementById("nxtbtn").style.display="none";
	}
	else{
	if(i==0){
		document.getElementById("prevbtn").style.display="none";
	}else{
		document.getElementById("prevbtn").style.display="inline";
	}
	if(i == nofkeys-1){
		document.getElementById("nxtbtn").style.display="none";
	}else{
		document.getElementById("nxtbtn").style.display="inline";
	}	
	}
	document.getElementById("pfare").innerHTML = arrPckgs[i].fare;
	document.getElementById("psize").innerHTML = arrPckgs[i].size;
	document.getElementById("pdatetym").innerHTML = arrPckgs[i].datetym;
	document.getElementById("ppickup").innerHTML = arrPckgs[i].pickup;	
	document.getElementById("pdelv").innerHTML = arrPckgs[i].delv;	
	document.getElementById("rqstgist").style.display="block";
	$("#tflbckg").css("background-image", "url('" + arrPckgs[i].img + "')");
	if(i==0&&map===undefined){
		window.location.reload();
	}
	map.panTo(new google.maps.LatLng(arrPckgs[i].pickuplat, arrPckgs[i].pickuplng));	
	}
	
	function shownext(){
		if((rsltshow+1)<nofkeys){
			rsltshow++;
			$("#tflbckg").css("background-image", "");
			showreslt(rsltshow);
			drawroute(arrPckgs[rsltshow].pickuplat, arrPckgs[rsltshow].pickuplng, arrPckgs[rsltshow].delvlat, arrPckgs[rsltshow].delvlng);
		}		
		
	}
	
	function showprev(){
		if(rsltshow>0){
			rsltshow--;
			$("#tflbckg").css("background-image", "");
			showreslt(rsltshow);
			drawroute(arrPckgs[rsltshow].pickuplat, arrPckgs[rsltshow].pickuplng, arrPckgs[rsltshow].delvlat, arrPckgs[rsltshow].delvlng);
		}			
	}
	
	var path = null;
	var hotSpotMapMarkers = [];
	
	function drawroute(picklat,picklng,delvlat,delvlng){	
	for (var i = 0; i < hotSpotMapMarkers.length; i++)
    hotSpotMapMarkers[i].setMap(null);
	map.setCenter(new google.maps.LatLng(picklat,picklng));
	var flightPlanCoordinates = [{lat:picklat,lng:picklng},{lat:delvlat,lng:delvlng}];
	var latlngbounds = new google.maps.LatLngBounds();
	latlngbounds.extend(new google.maps.LatLng(picklat,picklng));
	latlngbounds.extend(new google.maps.LatLng(delvlat,delvlng));
	map.setCenter(latlngbounds.getCenter()); map.fitBounds(latlngbounds);
	var polyLine = new google.maps.Polyline({
    path: flightPlanCoordinates,
    strokeColor: "#2bb1de",
	strokeWeight: 2,
	geodesic:true
	});
	var prepath = path;
	if(prepath){prepath.setMap(null);
	}
	polyLine.setMap(map);
	path = polyLine;
	hotSpotMapMarkers.push(new google.maps.Marker({
    position: new google.maps.LatLng(picklat, picklng),
    optimized: true,
	icon: "package.png",
    map: map
	}));
	hotSpotMapMarkers.push(new google.maps.Marker({
    position: new google.maps.LatLng(delvlat, delvlng),
    optimized: true,
	icon: "package.png",
    map: map
	}));
	}
	
	function shwdetls(){
		document.getElementById("tytl").innerHTML="Add a Request below";
		document.getElementById("lala2").style.display = "block";
		document.getElementById("card").style.display = "block";
		document.getElementById("lala").style.display = "none";
		document.getElementById("delvlala2").style.display = "block"
		document.getElementById("delvlala").style.display = "none";
		document.getElementById("postbtn").style.display = "none";
		document.getElementById("posting").style.display = "none";
		document.getElementById("prevbtn2").style.display = "none";
		document.getElementById("nxt").style.display = "block";
		document.getElementById("farediv").style.display="none";
	}
	
	function showprev2(){
		document.getElementById("card").style.display = "none";
		document.getElementById("packagephoto").style.display = "none";
		document.getElementById("lala2").style.display = "none";
		document.getElementById("lala").style.display = "block";
		document.getElementById("delvlala2").style.display = "none"
		document.getElementById("delvlala").style.display = "block";
		document.getElementById("postbtn").style.display = "block";
		document.getElementById("prevbtn2").innerHTML = "BACK";
		document.getElementById("prevbtn2").style.display = "block";
		document.getElementById("nxt").style.display = "none";
	}
	
	function createVehicleMarker(vehicle,vehicleId) {	
	var nwfr;
	if(vehicle.order.fare != "GET QUOTE"){
		nwfr = convcurr+" "+String(Math.round((vehicle.order.fare)/conval));	
	}else{
		nwfr = "GET QUOTE";
	}
	arrPckgs.push({
		status:"Not Approved Yet",
		img: vehicle.img.img64,
		id: vehicle.order.id,
		fare: nwfr,
		pickuplat: vehicle.order.pickuplat,
		pickuplng: vehicle.order.pickuplng,
		delvlat: vehicle.order.delvlat,
		delvlng: vehicle.order.delvlng,
		delv: vehicle.order.deliveryarea,
		size: vehicle.order.pckgsize,
		weight:vehicle.order.pckgweight,
		date: vehicle.order.deliverydate,
		time: vehicle.order.deliverytime,
		datetym: "By "+vehicle.order.deliverydate+" " + vehicle.order.deliverytime,
		pickup: vehicle.order.pickuparea,
		pickupname: vehicle.order.pickupname,
		pickupnum: vehicle.order.pickupnum,
		delvname: vehicle.order.deliveryname,
		delvnum: vehicle.order.deliverynum,		
		pickupaddr: vehicle.order.pickupaddr,
		deliveryaddr: vehicle.order.deliveryaddr,
		usrid: vehicle.order.usrid,
        usrname: vehicle.order.usrname,
		usrphn: vehicle.order.usrphone,
        sortable: true
    });
	}
	
	function findAndRemove(array, property, value) {
	array.forEach(function(result, index) {
    if(result[property] === value) {
      array.splice(index, 1);
    }    
	});
	}
	
	function callauto3(){
		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchloc3'));
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', function() {
		  var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
		  center = place.geometry.location;
			if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join('');
			document.getElementById("farediv").style.display="none";
			document.getElementById("postbtn").style.display="block";
			document.getElementById("posting").style.display="none";
			pickuplat = Number((String(center.lat()).split(".")[0])+"."+String((String(center.lat()).split(".")[1]).substr(0,2)+Math.floor(Math.random() * 100)));
			pickuplng = Number(center.lng());
          }          
        });
	}
	
	function callauto2(){
		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchloc2'));
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', function() {
		  var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
			center = place.geometry.location;
			if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join('');
			document.getElementById("farediv").style.display="none";
			document.getElementById("postbtn").style.display="block";
			document.getElementById("posting").style.display="none";
			delvlat = center.lat(); delvlng = center.lng();
          }          
        });
	}
	
	
	  function smsmatchdmnd(number,name1,num1){
	if(String(number).substring(0, 2) == '91'){
	  $.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(name1).split(" ")[0].substring(0, 30)+'. You can reach him at '+num1
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(name1).split(" ")[0].substring(0, 30)+'. You can reach him at '+num1
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	}
	
	function smsmatchsuppl(number){	
	if(String(number).substring(0, 2) == '91'){
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can reach him at '+usrphone
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can reach him at '+usrphone
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	}
	
	
	function befrlogin(){
		swal({ title: "Love to have you on board",   text: "Enter into your BECK Friends Account with Facebook",   type: "success",   showCancelButton: true,   confirmButtonColor: "#2bb1de",   confirmButtonText: "Go Ahead" }, function(){login()});		
	}
	function callauto(){		
		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchloc'));
        autocomplete.bindTo('bounds', map);
		setTimeout('$("body").css("visibility","visible");', 1000);
        autocomplete.addListener('place_changed', function() {
		  var place = autocomplete.getPlace();
          if (!place.geometry) {
           return;
          }
		  if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12); 
			
          } 
			var center = place.geometry.location;
			mycenter = center;
			getReverseGeocodingData(center.lat(), center.lng());
			geoQuery.updateCriteria({center: [center.lat(), center.lng()],  radius: 30});
			if(path) path.setMap(null);
			for (var i = 0; i < hotSpotMapMarkers.length; i++)
			hotSpotMapMarkers[i].setMap(null);
			if(path) path.setMap(null);
			document.getElementById("rqstgist").style.display="none";
			document.getElementById("pckgctr").innerHTML="Loading...";
			var address = ''; rsltshow = 0; google.maps.event.trigger(map, 'resize');
			$("#tflbckg").css("background-image", "");
			$('.close-initModal').trigger('click');			
			if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
			
          }          
        });
	}
	
	function checkfirebase(email){	
		if(clicklogin==1){
			console.log("view called");
			$('body').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold">Syncing your details...</div>'); }
			});
		}	
		usrnewmail = String(email).replace(/[^a-zA-Z0-9]/g, ' ');
		firebaseRef.child("users").once("value", function(snapshot) {			
			if(snapshot.hasChild(usrnewmail)){
				usrname = snapshot.child(usrnewmail).child("usrname").val();
				usremail=  snapshot.child(usrnewmail).child("usremail").val();
				usrphone = snapshot.child(usrnewmail).child("usrphone").val();
				usrid = snapshot.child(usrnewmail).child("usrid").val();
				fbflag = 0; loggedin = 1;	
				$('body').plainOverlay('hide');			
			}else if(clicklogin==1){
				$('body').plainOverlay('hide');					
				swal({title: "Mobile Verification", text: "",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				if(usremail=="" || usremail===undefined){ swal({   title: "Your Email!",   text: "Oops! There was a problem confirming your email",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your email here" }, function(inputValuez){   if (inputValuez === false) return false;      if (inputValuez === "") {     swal.showInputError("You need to write something!");     return false   }     usrnewmail = String(inputValuez).replace(/[^a-zA-Z0-9]/g, ' '); usremail = inputValuez})};
				firebaseRef.child("users").child(usrnewmail).update({
					usrname:usrname, usremail:usremail, usrid:usrnewmail, usrphone:intno, usrfbimg:usrfbimg, usrfbid:usrfbid
				});				
				usrphone = intno;
				usrid = usrnewmail;
				var regsclbck = "New user registered on friends : "+usrname+" "+usrphone+" "+usremail;
				//mailcall(regsclbck);			
				swal("Verification Succesful", "Congratulations. You are succesfully registered with BECK!", "success"); 
				loggedin = 1;
				_fbq.push(['track', 'CompleteRegistration']);				
				});
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');
			}; 			
		});
	}