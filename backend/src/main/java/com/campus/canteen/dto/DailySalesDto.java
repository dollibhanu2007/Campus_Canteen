package com.campus.canteen.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailySalesDto {
    private LocalDate date;
    private long orderCount;
    private BigDecimal totalSales;

    public DailySalesDto() {}

    public DailySalesDto(LocalDate date, long orderCount, BigDecimal totalSales) {
        this.date = date;
        this.orderCount = orderCount;
        this.totalSales = totalSales;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }
}
