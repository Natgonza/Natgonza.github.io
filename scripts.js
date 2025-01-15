function openCategory(evt, categoryName) {
    //Hide all tab contents
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].computedStyleMap.display = "none";
    
    }//end for

    //Remove "active" class from all tab links
    tablinks = document.getElementsByClassName("tablink");
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active","");

    }//end for

    //Show current tab and add an "active" class to the clicked tab
    document.getElementById(categoryName).style.display = "block";
    evt.currentTarget.className += " active";

}//end openCategory

document.getElementsByClassName("tablink")[0].click();