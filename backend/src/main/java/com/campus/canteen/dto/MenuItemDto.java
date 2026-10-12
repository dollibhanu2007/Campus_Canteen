package com.campus.canteen.dto;

import java.math.BigDecimal;

public class MenuItemDto {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private BigDecimal price;
    private String imageUrl;
    private boolean available;
    private boolean isVeg;
    private Integer preparationTimeMins;

    public MenuItemDto() {}

    public MenuItemDto(Long id, String name, String description, Long categoryId, String categoryName,
                       BigDecimal price, String imageUrl, boolean available, boolean isVeg, Integer preparationTimeMins) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.available = available;
        this.isVeg = isVeg;
        this.preparationTimeMins = preparationTimeMins;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { isVeg = veg; }

    public Integer getPreparationTimeMins() { return preparationTimeMins; }
    public void setPreparationTimeMins(Integer preparationTimeMins) { this.preparationTimeMins = preparationTimeMins; }
}
