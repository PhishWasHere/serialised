module com.jda.serialised {
    requires javafx.controls;
    requires javafx.fxml;
    requires net.dv8tion.jda;
    requires annotations;
    requires org.json;


    opens com.jda.serialised to javafx.fxml;
    exports com.jda.serialised;
}