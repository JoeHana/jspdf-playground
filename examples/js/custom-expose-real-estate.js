// Demo Data
var data = {
	
    title        : 'Sample Title',
	
};

var doc = new jsPDF();

// add info
doc.setFontSize(12);
doc.setTextColor(100);

doc.text(data.title, 10, 10);
