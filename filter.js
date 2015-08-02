/*filter on categories variables*/ 
var selectedCategoryIDs = new Set();
var categoriesIDvalues = [];


function filterSelection(categories){
    categoriesIDvalues = categories.map(function(cat){
      return cat.id;
    });
    categoriesSelectionBox(categories);     
}

function addToSelection(d) {
  if (d.checked)
    selectedCategoryIDs.add(d.value);
  else
    selectedCategoryIDs.delete(d.value);    

  filter_categories();
}

function selectAll_filter(){
  var inputs = $('.multiSelect input[type="checkbox"]');
  for (var i=0; i<categoriesIDvalues.length; i++) {
    if (!(inputs[i].checked)) {
      var title = inputs[i].value + ",";
      var html = '<span title="' + title + '">' + title + '</span>';
      $('.multiSel').append(html); 
      selectedCategoryIDs.add(inputs[i].value);
    }
  }
  inputs.prop('checked',true);
  filter_categories();
}

function clear_filter(){
   var inputs = $('.multiSelect input[type="checkbox"]');
   inputs.prop('checked',false);
   for (var i=0; i<categoriesIDvalues.length; i++) {
    var title = inputs[i].value + ",";
    $('span[title="' + title + '"]').remove(); 
    selectedCategoryIDs.delete(inputs[i].value);
    }
  filter_categories();
}

function filter_categories() {         
   if(selectedCategoryIDs.size===0) {
    categoriesIDvalues.forEach(function(catID) {
      var eventsByCategory = category2events.get(Number(catID));
      if(eventsByCategory){
        eventsByCategory.forEach(function(evtID){
               var circle = d3.select("#id"+evtID);
               circle[0][0].parentNode.style["opacity"] = null;        
        });
      }
    });
    return;      
   }

   selectedCategoryIDs.forEach(function(catID) {
      var eventsByCategory = category2events.get(Number(catID));
      if(eventsByCategory){ 
        eventsByCategory.forEach(function(evtID){
          var circle = d3.select("#id"+evtID);
          circle[0][0].parentNode.style["opacity"] = null;
        });
      }
   }); 

   categoriesIDvalues.forEach(function(catID) {
      if (!selectedCategoryIDs.has(""+ catID)){
        var eventsByCategory = category2events.get(Number(catID));
        if(eventsByCategory){ 
          eventsByCategory.forEach(function(evtID){
            var circle = d3.select("#id"+evtID);
            circle[0][0].parentNode.style["opacity"] = 0;
          });
        }
      }
   });
}

function categoriesSelectionBox(categories){

  var content = d3.select(".leaflet-top");
  var div = content.append("div").attr("class", "leaflet-control");
  div.html("<dl class=\"dropdown\"><dt><a href=\"#\"><span class=\"hida\">Category list : </span><span class=\"multiSel\"></span></a></dt><dd><div class=\"multiSelect\"></div></dd><input type=\"submit\" onclick=\"selectAll_filter()\" value=\"Select All\"><input type=\"submit\" onclick=\"clear_filter()\" value=\"Clear Selection\"></dl>");
  var multiSelect = div.select(".multiSelect").html("<ul id=\"filterSelection\"></ul>");
  var list = multiSelect.select("#filterSelection");
  var li_cat = list.selectAll("li").data(categories, function(d){
    return d.id;
  })
  .enter().append("li")
  .attr("id", function(d){
    return "id"+d.id;
  });
  li_cat
  .html(function(d){
     return "<input type=\"checkbox\" onclick=\"addToSelection(this)\" value="+ d.id + ">"
             + d.name;
  }); 

  $(".dropdown dt a").on('click', function () {
        $(".dropdown dd ul").slideToggle('fast');
    });

  $(".dropdown dd ul li a").on('click', function () {
      $(".dropdown dd ul").hide();
  });

  function getSelectedValue(id) {
       return $("#" + id).find("dt a span.value").html();
  }

  $(document).bind('click', function (e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
  });


  $('.multiSelect input[type="checkbox"]').on('click', function () {
    
      var title = $(this).closest('.multiSelect').find('input[type="checkbox"]').val(),
          title = $(this).val() + ",";
    
      if ($(this).is(':checked')) {
          var html = '<span title="' + title + '">' + title + '</span>';
          $('.multiSel').append(html);
          //$(".hida").hide();
      } 
      else {
          $('span[title="' + title + '"]').remove();
          //var ret = $(".hida");
          //$('.dropdown dt a').append(ret);
          
      }
  });

}    