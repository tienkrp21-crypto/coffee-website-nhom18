package com.nhom18.coffee.QLcategories;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // Bổ sung thêm 2 cột bị thiếu theo đúng Database của bạn
    private String description;

    // Trong DB là tinyint, map sang Java dùng Integer là chuẩn nhất
    private Integer status;

    // --- GETTER & SETTER ---
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }
}