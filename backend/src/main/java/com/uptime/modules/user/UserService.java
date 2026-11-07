package com.uptime.modules.user;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.utils.FileUtils;
import com.uptime.modules.user.dto.AddressCreateRequest;
import com.uptime.modules.user.dto.UserDTO;
import com.uptime.modules.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final com.uptime.common.service.MediaStorageService mediaStorageService;

    @Transactional(readOnly = true)
    public UserDTO getMe(Long userId) {
        if (userId == null) {
            throw new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User ID is required");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User not found"));
        return toDTO(user);
    }

    @Transactional
    public UserDTO updateMe(Long userId, UserUpdateRequest req) {
        if (userId == null) {
            throw new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User ID is required");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User not found"));
        if (user == null) {
            throw new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User not found");
        }
        if (req.getFullName() != null) user.setFullName(req.getFullName().trim());
        if (req.getEmail() != null) user.setEmail(req.getEmail().trim());
        if (req.getDateOfBirth() != null) user.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getIndustryPreference() != null) user.setIndustryPreference(req.getIndustryPreference());
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO uploadPhoto(Long userId, MultipartFile file) {
        FileUtils.verifyMagicBytes(file);
        if (userId == null) {
            throw new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User ID is required");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "User not found"));
        String photoUrl = mediaStorageService.uploadMultipart(file, "uptime/users");
        user.setProfilePhotoUrl(photoUrl);
        return toDTO(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserAddress> getAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
    }

    @Transactional
    public UserAddress addAddress(Long userId, AddressCreateRequest req) {
        UserAddress addr = UserAddress.builder()
                .userId(userId)
                .label(req.getLabel())
                .addressLine1(req.getAddressLine1())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .isDefault(Boolean.TRUE.equals(req.getIsDefault()))
                .build();
        if (addr == null) {
            throw new IllegalStateException("Failed to build address");
        }
        return addressRepository.save(addr);
    }

    public static UserDTO toDTO(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .phoneVerified(u.getPhoneVerified())
                .profilePhotoUrl(u.getProfilePhotoUrl())
                .dateOfBirth(u.getDateOfBirth())
                .gender(u.getGender())
                .userType(u.getUserType())
                .industryPreference(u.getIndustryPreference())
                .greenPointsBalance(u.getGreenPointsBalance())
                .carbonCreditsBalance(u.getCarbonCreditsBalance())
                .referralCode(u.getReferralCode())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
