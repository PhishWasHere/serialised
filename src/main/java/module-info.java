module com.jda.serialised {
    requires javafx.controls;
    requires javafx.fxml;
    requires net.dv8tion.jda;
    requires annotations;
    requires org.json;
    requires com.fasterxml.jackson.databind;
    requires com.google.gson;
    requires lavaplayer;

//    opens com.jda.serialised to com.google.gson;
    opens com.jda.serialised to javafx.fxml;
    exports com.jda.serialised;
    exports com.jda.serialised.utils.eventUtils to com.fasterxml.jackson.databind;
}