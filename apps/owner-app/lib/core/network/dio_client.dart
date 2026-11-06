import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/app_config.dart';

class TokenMemoryStore {
  String? accessToken;
  String? refreshToken;
}

final tokenStoreProvider = Provider<TokenMemoryStore>((ref) => TokenMemoryStore());

final dioClientProvider = Provider<Dio>((ref) {
  final tokenStore = ref.watch(tokenStoreProvider);
  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.apiUrl,
      connectTimeout: const Duration(seconds: 4),
      receiveTimeout: const Duration(seconds: 6),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        if (tokenStore.accessToken != null && tokenStore.accessToken!.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer ${tokenStore.accessToken}';
        }
        handler.next(options);
      },
    ),
  );

  return dio;
});
