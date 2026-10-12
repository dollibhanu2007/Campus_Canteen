package com.campus.canteen.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SalesReportDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private List<DailySalesDto> dailyBreakdown;

    public SalesReportDto() {}

    public SalesReportDto(LocalDate startDate, LocalDate endDate, long totalOrders,
                          BigDecimal totalRevenue, List<DailySalesDto> dailyBreakdown) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.dailyBreakdown = dailyBreakdown;
    }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<DailySalesDto> getDailyBreakdown() { return dailyBreakdown; }
    public void setDailyBreakdown(List<DailySalesDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; }
}
