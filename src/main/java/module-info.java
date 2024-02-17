module com.jdabot.demo {
    requires javafx.controls;
    requires javafx.fxml;
    requires org.apache.commons.cli;
    requires net.dv8tion.jda;
    requires annotations;


    opens com.jdabot.demo to javafx.fxml;
    exports com.jdabot.demo;
}