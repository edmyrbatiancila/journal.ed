$(document).ready(function() {
    const phtOffset     = 8 * 60;
    const localTime     = new Date();
    const localOffset   = localTime.getTimezoneOffset() * 60000;
    const phTime        = new Date(localTime.getTime() + localOffset + (phtOffset * 60000));

    const isEvening = phTime.getHours() >= 18;

    const minimumDate = isEvening ? 1 : 0;

    $('#date').datepicker({
        changeMonth: true,
        changeYear: true,
        minDate:    minimumDate, 
        maxDate:    "+1M +10D",
        showButtonPanel: true
    });

    // below is for dialog pop up setup:
    $('#dialog').dialog({
        autoOpen: false,
        show: {
            effect:     "blind",
            duration:    1000
        },
        hide: {
            effect:     "explode",
            duration:    1000
        }
    });

    // initialization of days counter:
    let dayCount        = 1;
    let existingDates   = [];

    $('#form-journal').submit(function(event) {
        
        event.preventDefault();
        const dateData = $('#date').val();

        if(dateData === "mm/dd/yyyy" || dateData === "") {
            $('#dialog .content').text("Please don't forget to choose Date!");
            $('#dialog').dialog("open");
        } else if(existingDates.includes(dateData)) {
            // this will check if the dates already exist or not.
            $('#dialog .content').text("Date already exist");
            $('#dialog').dialog("open");
        } else {
            // if date is valid it will create an accordion:
            const accordionItem = `
                <h3 class="title-accordion">Day ${dayCount}: ${dateData}</h3>
                <div class="accordion-contents">
                    <p class="empty">No Entry yet</p>
                    <div class="btn-add">
                        <button class="add-btn" data-day="${dayCount}">Add New Entry</button>
                    </div>
                </div>
            `;
            
        
            $('#journal-accordion').append(accordionItem);
            $('.accordion-contents').css({
                "padding": "50px",
                "height": "200px"
            });

            $('.empty').css({
                "paddingBottom": "20px",
                "fontWeight": "bold"
            });

            $('.btn-add').css({
                "display": "flex",
                "justifyContent": "flex-end",
            });

            $('.add-btn').css({
                "padding": "10px 5px 10px 5px",
                "cursor": "pointer",
                "backgroundColor": "rgb(11, 11, 124)",
                "color": "white",
                "fontWeight": "bold"
            });

            $('.add-btn').hover(function() {
                $(this).css({
                    "backgroundColor": "blueviolet"
                });
            }, function() {
                $(this).css({
                    "backgroundColor": "rgb(11, 11, 124)"
                });
            });

            if(!$('#journal-accordion').hasClass('ui-accordion')) {
                $('#journal-accordion').accordion();
            } else {
                $('#journal-accordion').accordion("refresh");
            }

            // increment days for every successful accordion inserted:
            dayCount++;

            // add the dates in the array:
            existingDates.push(dateData);

            // Reset the date field.
            $('#date').val("mm/dd/yyyy");
        }
        
        return false;
    });

    $(document).on('click', '.add-btn', function() {
        const day = $(this).data("day"); // Get the number day as a unique identifier.
        $('#entryModal').data('day', day).dialog('open');
        console.log(day);
    });
    $('#entryModal').dialog({
            autoOpen:   false,
            modal:      true,
            buttons: {
                "Cancel": function() {
                    $(this).dialog("close");
                },
                "Save Entry": function() {
                    const title     = $('#title').val();
                    const content   = $('#content').val();
                    const day       = $(this).data('day');

                    // Append the accordion based on the Journal entry form data entered and then user can allow to add new additional entry within a specific date:
                    const newEntry = `
                        <div class="new_entry">
                            <div class="title">
                                <span>Title:</span>
                                <p><strong>${title}</strong></p>
                            </div>
                            <p class="content">${content}</p>
                        </div>
                    `;
                    const daySection = $(`#journal-accordion h3:contains('Day ${day}')`).next();

                    const noDataEntryParagraph = daySection.find('p').first();
                    noDataEntryParagraph.remove(); // Ensures that the "No Entry yet" paragraph will be remove after adding new entry.
                    const duplicateButton = daySection.find('button').first();
                    duplicateButton.remove();

                    // append the accordion based on the new entry within a specific date.
                    daySection.append(newEntry);
                    $('.new_entry').css({
                        "paddihg": "50px"
                    });
                    $('.title').css({
                        "display": "flex",
                        "gap": "50px",
                        "marginBottom": "30px",
                        "padding": "15px",
                        "backgroundColor": "gray",
                        "color": "white"
                    });
                    $('.content').css({
                        "marginBottom": "30px",
                        "padding": "20px",
                        "backgroundColor": "brown",
                        "color": "white"
                    });
                

                    $(this).dialog("close");
                    $('#title').val("");
                    $('#content').val("");
                }
            }
        });
});