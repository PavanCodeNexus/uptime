package com.uptime.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <T> PagedResponse<T> of(Page<T> page) {
        return PagedResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public static <T> PagedResponse<T> ofList(List<T> items, int page, int size, long total) {
        int totalPages = size <= 0 ? 1 : (int) Math.ceil((double) total / size);
        return PagedResponse.<T>builder()
                .content(items)
                .page(page)
                .size(size)
                .totalElements(total)
                .totalPages(totalPages)
                .last(page + 1 >= totalPages)
                .build();
    }
}
