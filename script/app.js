var pz = null;
var base_scale = null;
var min_scale = 0.01;
var current_focal_length = 1;


function get_base_focal_length() {
  const base_focal_length = document.querySelector("input[name=base_focal_length]");
  return base_focal_length.value;
}

function get_crop_factor() {
  const crop_factor = document.querySelector("input[name=crop_factor]");
  return crop_factor.value;
}

function set_current_focal_length(fl) {
  current_focal_length = fl;
  document.querySelector("input[name=current_focal_length").value = fl;
  document.querySelector("input[name=fl2_range]").value = fl;
  document.querySelector("input[name=fl2_range_wide]").value = fl;
  document.querySelector("input[name=fl2_range_std]").value = fl;
  document.querySelector("input[name=fl2_range_tele]").value = fl;
}

function set_base_focal_length(fl) {
  document.querySelector("input[name=base_focal_length]").value = fl;
  set_current_focal_length(fl);
}

function zoom_focal_length(current, target) {
  const offset_x = document.getElementById("container").offsetWidth / 2;
  const offset_y = document.getElementById("container").offsetHeight / 2;
  pz.zoomTo(offset_x, offset_y, target / current);

  set_current_focal_length(target);
}

function image_upload_init() {
  document.getElementById('imageUpload').addEventListener('change', function(event){
	if (this.files && this.files[0]) {
      var output = document.getElementById('photo');
      var file = this.files[0];

      EXIF.getData(file, function() {
        var focalLength = EXIF.getTag(this, 'FocalLength');
		if (focalLength) {
		  set_base_focal_length(focalLength.numerator / focalLength.denominator);
		}
	  });
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
      }
	}
  });
}

function app_init() {
  const elem = document.getElementById("panzoom");
  pz = panzoom(elem,
			   {
				 autocenter: true,
				 zoomSpeed: 0.05,
			   });


  // Center the photo
  const scale = pz.getTransform().scale
  const to_x = (document.getElementById("container").offsetWidth / 2) -
		((elem.offsetWidth * scale) / 2);
  const to_y = (document.getElementById("container").offsetHeight / 2) -
		((elem.offsetHeight * scale) / 2);

  base_scale = scale;
  pz.moveTo(to_x, to_y);
  pz.setMinZoom(min_scale);
  pz.on('zoom', function(e) {
	const scale = pz.getTransform().scale;
	set_current_focal_length(get_base_focal_length() * scale / base_scale);
  });

  // Set base focal length
  set_base_focal_length(get_base_focal_length());

  const flsim = document.getElementById("fl-sim");
  const border_width = 10;
  const offset_top = document.getElementById("container").offsetTop;
  const offset_left = document.getElementById("container").offsetLeft;
  flsim.style.height = (elem.clientHeight*scale + 1 - border_width * 2) + "px";
  flsim.style.width = (elem.clientWidth*scale - offset_left - 1 - border_width) + "px";
  flsim.style.top = (to_y + offset_top) + "px";
  flsim.style.left = (to_x + offset_left) + "px";
}

function update_current_focal_length() {
  const label = document.querySelector("input[name=current_focal_length]");

  console.log(event.key);
  if (event.key !== "Enter") {
	return;
 }
  zoom_focal_length(current_focal_length, label.value);
}


function change_fl_zone_indicator(range_name) {
  const range = document.querySelector(`input[name=${range_name}]`);
  zoom_focal_length(current_focal_length, range.value);
}
