import java.util.*;
import java.io.*;

public class Person{

    String name;
    int birthYear;

    public Person(String name, int birthYear){
        this.name=name;
        this.birthYear=birthYear;

    }


public class Staff extends Person{

    int salary;

    public Staff(String name,int birthYear,int salary){
        super(name,birthYear);
        this.salary=salary;
    }
    

}

public class Student extends Person{

    String department;
    int attendance;

    public Student(String name,int birthYear,String department, int attendance){
       
        super(name,birthYear);
        this.department=department;

    }

}

public class TeachingStaff extends Staff{

    String subject;
    int result;

    public TeachingStaff(String name,int birthYear, int salary, String subject, int result){
        super(name,birthYear,salary);
        this.subject=subject;
        this.result=result;
    }
}

public class NonTeachingStaff extends Staff{

    String Lab;
    int experience;

    public NonTeachingStaff(String name,int birthYear, int salary,String Lab, int experience){
        super(name,birthYear,salary);
        this.Lab=Lab;
        this.experience=experience;
        
    }

}

public static void main(String[] args){

    Scanner sc = new Scanner(System.in);
    int num = sc.nextInt();
    if(num==1){
        String name=sc.nextLine();
        int birthYear = sc.nextInt();
        String department = sc.nextLine();
        int attendance=sc.nextInt();
        Person a= new Student(name,birthYear,department,attendance);
        System.out.println(a);

    }

    else if(num==2){
        String name=sc.nextLine();
        int birthYear = sc.nextInt();
        String subject = sc.nextLine();
        int result=sc.nextInt();
        int salary=sc.nextInt();
        Person a= new Staff(name,birthYear,salary,subject,result);
        System.out.println(a);

    }

    else if(num==3){
        String name=sc.nextLine();
        int birthYear = sc.nextInt();
        String Lab = sc.nextLine();
        int experience=sc.nextInt();
        int salary=sc.nextInt();
        Person a= new NonSteachingStaff(name,birthYear,salary,Lab,experience);
        System.out.println(a);

    }
    else{
        System.out.println("enter from 1,2,3");
    }


} 
}